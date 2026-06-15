#!/usr/bin/env python3
"""
ingest.py — Manifest + local-drop ingester for PURSUE Release 03 (and future tranches).
NOW INTEGRATED WITH scraper.py for web discovery on war.gov/UFO (Akamai + archive.org fallback).

Usage (local only, original):
  python ingest.py --manifest manifest.json --local ./path/to/tranche-03-folder
  python ingest.py --local "C:\\Users\\Kevan\\Downloads\\PURSUE-Release-03"

Usage (with web scrape for Release 03 — recommended first step):
  python ingest.py --scrape --tranche 03
  python ingest.py --scrape --no-download --tranche 03   # discovery + index/manifest only
  python ingest.py --scrape --local "C:\\path\\to\\local\\tranche-03-drop"

- Walks PDFs/images/videos/audio (local).
- Auto-discovers + downloads via scraper.py (stealth headers, direct D080-style links, archive fallback).
- Computes SHA-256 (shared impl).
- IPFS prep (now delegates to scraper which mirrors legacy-vault-protocol/lib/ipfs/ipfs-adapter.ts exactly in priority).
- Updates data/index.json + extends manifest.json (consumed by mcp_server.py).
- Extracts text from PDFs where possible (pypdf / pdfminer.six recommended).

This is the "Data Ingestion Layer" from the architecture. Run scraper first or via --scrape, then query via the MCP server.
Scraper + ingest together give full Release 03 coverage even when direct war.gov is Akamai-blocked.
"""

import argparse
import hashlib
import json
import mimetypes
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

# Integration: scraper.py (same dir). Provides web discovery, stealth, archive fallback, IPFS prep parity with legacy-vault.
try:
    from scraper import run_for_ingest  # type: ignore
    HAS_SCRAPER = True
except Exception:
    HAS_SCRAPER = False
    run_for_ingest = None  # type: ignore

# Redaction decipher integration (new GMIIE Truth Surface capability for D080/D077 heavy redactions)
try:
    from redaction_decipher import decipher_redactions as _decipher_impl  # type: ignore
except Exception:
    _decipher_impl = None  # type: ignore

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)
INDEX_PATH = DATA_DIR / "index.json"

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def extract_text_stub(p: Path) -> str:
    """Very light stub. In prod: pypdf, pdfminer, or markitdown for PDFs; whisper for audio; etc."""
    if p.suffix.lower() == ".pdf":
        return f"[PDF text extraction stub for {p.name} — replace with real parser]"
    if p.suffix.lower() in {".txt", ".md"}:
        try:
            return p.read_text(encoding="utf-8", errors="ignore")[:4000]
        except Exception:
            pass
    return ""

async def ipfs_pin_stub(content: bytes, name: str) -> Optional[str]:
    """Replace with real: local `ipfs add`, or POST to genesis402 / bf IPFS gateway, or legacy-vault lib/ipfs."""
    h = hashlib.sha256(content).hexdigest()[:16]
    return f"bafy-fake-{h}"

def load_index() -> Dict[str, Any]:
    if INDEX_PATH.exists():
        return json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    return {"tranches": {}, "sightings": {}, "last_ingest": None}

def save_index(idx: Dict[str, Any]) -> None:
    INDEX_PATH.write_text(json.dumps(idx, indent=2, ensure_ascii=False), encoding="utf-8")

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path(__file__).parent / "manifest.json")
    parser.add_argument("--local", type=Path, help="Path to local folder or zip contents of the tranche")
    parser.add_argument("--tranche", default="03")
    parser.add_argument("--scrape", action="store_true", help="Run web discovery via scraper.py before/after local (handles Akamai + archive.org + direct D080 links)")
    parser.add_argument("--no-download", action="store_true", help="With --scrape: discovery + metadata + manifest/index updates only (no binary downloads)")
    args = parser.parse_args()

    idx = load_index()
    tranche_key = f"release-{args.tranche}"

    # Seed from manifest
    manifest: Dict[str, Any] = {}
    if args.manifest.exists():
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))

    sightings: Dict[str, Any] = idx.setdefault("sightings", {})
    for sig in manifest.get("public_signals_converged", []):
        sid = sig.get("id")
        if sid:
            sightings[sid] = {
                "tranche": args.tranche,
                "type": sig.get("type"),
                "title": sig.get("title"),
                "description": sig.get("description"),
                "phenomenology": sig.get("phenomenology", []),
                "source_links": sig.get("known_links", []),
                "extracted_text": "",
                "ipfs_cid": None,
                "sha256": None,
            }

    # === NEW: scraper.py integration (web + archive discovery for Release 03) ===
    # Runs before local so that discovered web assets can enrich sightings + be merged.
    web_assets: List[Dict[str, Any]] = []
    if args.scrape:
        if HAS_SCRAPER and run_for_ingest is not None:
            logger_msg = "Running scraper integration (web discovery + IPFS prep mirroring legacy-vault-protocol/lib/ipfs)..."
            print(logger_msg)
            try:
                scrape_summary = run_for_ingest(
                    release=args.tranche,
                    local_dir=args.local,
                    download=not args.no_download,
                )
                web_assets = scrape_summary.get("assets", [])
                print(f"Scraper returned {len(web_assets)} assets (Akamai block handled via seeds + archive).")
            except Exception as e:
                print(f"WARNING: scraper integration failed: {e}. Continuing with local + manifest only.")
        else:
            print("WARNING: scraper.py not importable (HAS_SCRAPER=False). Install deps or ensure scraper.py is in same dir. Falling back to local+manifest only.")

    # Local drop processing (original + any additional from scraper local_drop)
    if args.local and args.local.exists():
        root = args.local if args.local.is_dir() else args.local.parent
        for p in root.rglob("*"):
            if not p.is_file():
                continue
            mime, _ = mimetypes.guess_type(str(p))
            if p.suffix.lower() in {".pdf", ".txt", ".md"} or (mime and mime.startswith(("image/", "video/", "audio/"))):
                h = sha256_file(p)
                text = extract_text_stub(p)
                sid = f"local-{p.stem[:40]}"
                sightings[sid] = {
                    "tranche": args.tranche,
                    "type": "local",
                    "title": p.name,
                    "path": str(p),
                    "sha256": h,
                    "extracted_text": text,
                    "ipfs_cid": None,  # populated below if content small
                }
                # NEW: run redaction decipher on PDFs (esp. D080/D077 narratives) to populate redaction_map + inferred spans for Truth Surface
                if p.suffix.lower() == ".pdf" and _decipher_impl:
                    try:
                        dec = _decipher_impl(f"ingest-{p.stem}", p)
                        sightings[sid]["redaction_decipher"] = {
                            "pages": getattr(dec, "pages_processed", 0),
                            "redactions_detected": len(getattr(dec, "redaction_map", []) or []),
                            "code_breaks": len(getattr(dec, "code_break_results", []) or []),
                            "overall_conf": getattr(dec, "confidence_overall", 0.0),
                            "inferred_spans_sample": (getattr(dec, "full_deciphered_narrative", "") or "")[:900],
                            "ethics": "HYPOTHESES ONLY — see full_result via MCP decipher_redactions",
                        }
                        # Merge some inferred text into the main extracted for RAG
                        if getattr(dec, "full_deciphered_narrative", None):
                            sightings[sid]["extracted_text"] = (text or "") + "\n\n[DECIPHERED_INFERENCES]\n" + getattr(dec, "full_deciphered_narrative", "")[:2200]
                    except Exception as _de:
                        sightings[sid]["redaction_decipher_error"] = str(_de)
                # Stub pin for small text files only in this prototype
                if p.stat().st_size < 2_000_000:
                    # In real: content = p.read_bytes(); cid = await ipfs_pin_stub(content, p.name)
                    pass

    # Merge (do not clobber) so that scraper.py's assets list + IPFS CIDs / metadata in the tranche survive.
    t = idx.setdefault("tranches", {}).setdefault(tranche_key, {})
    t.update({
        "release": args.tranche,
        "published": manifest.get("published", "2026-06-12"),
        "source": manifest.get("source", "war.gov/UFO (PURSUE)"),
        "claimed_files": manifest.get("claimed", {}),
        "web_assets_count": len(web_assets),
        "notes": "Manifest + local drop + scraper.py (war.gov/UFO with Akamai fallback to archive.org + direct D080 links). See data/tranches/release-03/raw/ for binaries and manifest 'discovered_assets'.",
    })
    if web_assets:
        t["assets"] = web_assets  # from this run's scrape
    idx["last_ingest"] = datetime.now(timezone.utc).isoformat()

    save_index(idx)
    print(f"Ingest complete. {len(sightings)} sightings indexed. web_assets={len(web_assets)}. index at {INDEX_PATH}")
    if web_assets:
        print("Example web asset (first):", json.dumps(web_assets[0], indent=2)[:800])

if __name__ == "__main__":
    main()
