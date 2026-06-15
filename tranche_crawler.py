#!/usr/bin/env python3
"""
Stub tranche_crawler.py — monitors Wayback CDX for new war.gov/UFO/release/* or seeds.
Calls scrape (via scraper.py or MCP scrape_pursue_tranche) on deltas.

Basic multi-tenancy: accepts optional project='ufo-pursue-r03' and passes through to scrape.

Intended for cron / background / MCP dispatch (e.g. from mcp_server or fth-mcp-hub agent).
Stub: one-shot or simple poll loop. Real impl would use persistent last-seen state (json), diffing, rate limits, alerts.

Per task: monitors wayback CDX for new war.gov/UFO/release/* or seeds, calls scrape.

Run:
  python tranche_crawler.py --release 03 --project ufo-pursue-r03 --once
  python tranche_crawler.py --poll 300   # seconds

Wires to: scraper.scrape_pursue_tranche (or the async variants), mcp_server full chain, investigations/ persistence.
"""

from __future__ import annotations

import argparse
import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import urlencode
import urllib.request

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | tranche-crawler | %(message)s")
logger = logging.getLogger("tranche-crawler")

try:
    from scraper import scrape_pursue_tranche as _direct_scrape_pursue_tranche  # type: ignore
    HAS_SCRAPER = True
except Exception:
    HAS_SCRAPER = False
    _direct_scrape_pursue_tranche = None  # type: ignore
    logger.warning("scraper not importable; crawler will stub calls only.")

# Prefer mcp_server rebound wrappers (accept project= for multi-tenancy + evidence under subdir)
try:
    from mcp_server import scrape_pursue_tranche as _mcp_scrape_pursue_tranche  # async wrapper with project support
    HAS_MCP_TOOLS = True
except Exception:
    HAS_MCP_TOOLS = False
    _mcp_scrape_pursue_tranche = None  # type: ignore

# Optional: httpx for richer (graceful)
try:
    import httpx  # type: ignore
    HAS_HTTPX = True
except Exception:
    HAS_HTTPX = False


CDX_BASE = "https://web.archive.org/cdx/search/cdx"
WAR_UFO_PREFIX = "war.gov/UFO/release/"


def _fetch_cdx(url_pattern: str = "war.gov/UFO/release/*", limit: int = 200, from_ts: Optional[str] = None) -> List[List[str]]:
    """Query Wayback CDX API. Returns list of [urlkey, timestamp, original, mimetype, statuscode, digest, length] rows (header first)."""
    params: Dict[str, Any] = {
        "url": url_pattern,
        "output": "json",
        "limit": str(limit),
        "filter": "statuscode:200",
        "collapse": "digest",  # dedup by content
    }
    if from_ts:
        params["from"] = from_ts
    q = urlencode(params)
    cdx_url = f"{CDX_BASE}?{q}"
    logger.info("CDX query: %s", cdx_url)

    try:
        if HAS_HTTPX:
            with httpx.Client(timeout=30.0, follow_redirects=True) as client:
                r = client.get(cdx_url)
                r.raise_for_status()
                data = r.json()
        else:
            with urllib.request.urlopen(cdx_url, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        if not data:
            return []
        # first row is header if json
        if isinstance(data[0], list) and data[0] and data[0][0] == "urlkey":
            return data[1:]
        return data
    except Exception as e:
        logger.warning("CDX fetch failed: %s", e)
        return []


def _extract_releases(rows: List[List[str]]) -> Dict[str, List[str]]:
    """Group discovered release/* paths by release id (e.g. '03')."""
    releases: Dict[str, List[str]] = {}
    for row in rows:
        if len(row) < 3:
            continue
        original = row[2]  # the archived original URL
        if WAR_UFO_PREFIX in original or "/UFO/release/" in original:
            # crude parse for release number
            for token in original.split("/"):
                if token.isdigit() or (len(token) <= 3 and token.replace("-", "").isdigit()):
                    rel = token.lstrip("0") or "0"
                    releases.setdefault(rel, []).append(original)
                    break
    return releases


def crawl_once(release: str = "03", project: str = "ufo-pursue-r03", download: bool = False) -> Dict[str, Any]:
    """One-shot: query CDX for the release (or all), detect signals, call scrape if new/seed hit."""
    pattern = f"{WAR_UFO_PREFIX}{release}/*" if release != "all" else "war.gov/UFO/release/*"
    rows = _fetch_cdx(pattern, limit=300)
    releases = _extract_releases(rows)

    logger.info("CDX hits for release(s): %s", list(releases.keys()) or "none (using seeds)")

    targets = releases.get(release, releases.get("03", [])) or []
    # Always include known seeds from manifest/seeds even on empty CDX (Akamai block case)
    seed_hits = [
        "https://www.war.gov/UFO/release/03/",
        "https://www.war.gov/medialink/ufo/061226/release_03/documents/DoW-UAP-D080_Narrative-2_Western-US-Event.pdf",
    ]

    result: Dict[str, Any] = {
        "ok": True,
        "project": project,
        "release": release,
        "cdx_hits": len(rows),
        "discovered_releases": list(releases.keys()),
        "targets_sample": (targets[:5] + seed_hits)[:8],
        "scrape_called": False,
        "scrape_result": None,
        "note": "Stub crawler — real runs would diff against prior state (data/crawler_state.json), throttle, and only invoke on delta.",
    }

    # Call scrape (propagates project for multi-tenancy persistence via mcp wrapper when available)
    scrape_target = None
    if HAS_MCP_TOOLS and _mcp_scrape_pursue_tranche is not None:
        scrape_target = ("mcp", _mcp_scrape_pursue_tranche)
    elif HAS_SCRAPER and _direct_scrape_pursue_tranche is not None:
        scrape_target = ("direct", _direct_scrape_pursue_tranche)

    if scrape_target:
        mode, fn = scrape_target
        try:
            if mode == "mcp":
                import asyncio
                # mcp wrappers are async def
                scrape_res = asyncio.run(fn(release=release, project=project, download=download))  # type: ignore
            else:
                # direct scraper.py impl does not take project (mcp wrapper adds it + write under subdir); call direct
                scrape_res = fn(release=release, download=download)  # type: ignore
                # best-effort: if mcp_server loaded, could re-call via wrapper but avoid double work
            result["scrape_called"] = True
            result["scrape_result"] = scrape_res
            logger.info("Called scrape (mode=%s release=%s project=%s) → %s", mode, release, project, "ok" if isinstance(scrape_res, dict) and scrape_res.get("ok") else "done")
        except Exception as e:
            logger.warning("scrape call from crawler failed: %s", e)
            result["scrape_result"] = {"error": str(e)}
    else:
        result["scrape_result"] = {"note": "scraper unavailable (stub mode; would call mcp_server.scrape_pursue_tranche or direct)"}

    # Persist a tiny state marker (under project if possible)
    try:
        state_dir = Path("data") / "crawler"
        state_dir.mkdir(parents=True, exist_ok=True)
        (state_dir / f"last_crawl_{project}_{release}.json").write_text(json.dumps({
            "ts": datetime.now(timezone.utc).isoformat(),
            "cdx_hits": len(rows),
            "project": project,
        }, indent=2), encoding="utf-8")
    except Exception:
        pass

    return result


def monitor_loop(release: str = "03", project: str = "ufo-pursue-r03", interval: int = 300, download: bool = False) -> None:
    """Simple polling loop (stub). In prod: use APScheduler / systemd timer / PM2 + dedup via digest state."""
    logger.info("Starting CDX monitor loop: release=%s project=%s interval=%ss (Ctrl-C to stop)", release, project, interval)
    try:
        while True:
            _ = crawl_once(release=release, project=project, download=download)
            logger.info("Sleep %s seconds until next CDX poll...", interval)
            time.sleep(interval)
    except KeyboardInterrupt:
        logger.info("Monitor stopped.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Wayback CDX tranche crawler stub for PURSUE / war.gov/UFO")
    parser.add_argument("--release", default="03", help="Release id (03, all, etc.)")
    parser.add_argument("--project", default="ufo-pursue-r03", help="Multi-tenancy project for persistence subdir")
    parser.add_argument("--once", action="store_true", help="One shot crawl + scrape call")
    parser.add_argument("--poll", type=int, default=0, help="Poll interval seconds (0 = once)")
    parser.add_argument("--download", action="store_true", help="Pass download=True to scrape (use with care)")
    args = parser.parse_args()

    if args.poll > 0:
        monitor_loop(release=args.release, project=args.project, interval=args.poll, download=args.download)
    else:
        res = crawl_once(release=args.release, project=args.project, download=args.download)
        print(json.dumps(res, indent=2, default=str))


if __name__ == "__main__":
    main()
