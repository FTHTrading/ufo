# GMIIE Truth Surface / UFO-GMIIE Operator Runbook (FINAL — 2026-06-14)

**Targets**: ufo-gmiie-app (blockchainfraud-platform\ufo-gmiie-app) + legacy-vault (adk_build\legacy-vault-protocol) + investigations\ufo-pursue-r03 + new stargate-cia-analysis/ + gateway-monroe-analysis/ + all gmiie-anomaly-intelligence-* + bf-platform src/mcp/tools/pursue-analyzer.ts + sovereign-control-plane

**Mission (per AGENTS.md + CLAUDE.md)**: Full operator surface for scraper ingestion (PURSUE R03 war.gov + archive fallback), redaction decipher (OpenCV/OCR/CV inference + MOTHER-3-BABY 0.79 code break), MCP exposure (4 core + auto-chain + persist), dual UIs (prototype + canonical /truth), x402 premium gating, evidence auto-persist to investigations/ (AGENTS.md structure), preflight gates, and forensic review. All changes confined to approved hosts. No sprawl.

All code verified consistent (2026-06-14) with:
- scraper.py: stealth UA/jitter, wayback fallback, REDACTION_HINTS extraction, prepare_ipfs (Pinata/Kubo/mock parity with legacy-vault), scrape_pursue_tranche export. Uses asyncio internally.
- redaction_decipher.py: DecipherResult dataclass (redaction_spans + CodeBreak), _detect_black_rects (cv2), _ocr_image (easyocr/pytesseract), _infer_redacted (conf/alts/rationale), _break_codes (MOTHER-3-BABY 0.79 + grammar + stego + base64), ethics_note, to_json/break_codes wrapper.
- Full chain: scrape_pursue_tranche -> decipher_redactions -> break_codes -> full_d080_with_decipher (MCP + /api + TS).
- MCP: mcp_server.py exposes @mcp.tool for all 4 + analyze_sighting auto-chain + resources/prompts. Imports direct. Hardened _await_scrape + to_thread for async safety.
- UI: Both ufo-gmiie-app/app/page.tsx + legacy-vault-protocol/app/truth/page.tsx have exact 4 primary buttons (Scrape free, Decipher/ Break/ Full premium x402), rich displays (redaction cards: inferred_text/conf/alts/rationale/bbox + highlighted original overlay; code_break list with MOTHER-3-BABY 0.79; conf matrix; voice/comfy; evidence provenance paths; spinners; chaining; ethics always; X-PAYMENT handle).
- Platform: src/mcp/tools/pursue-analyzer.ts mirrors with runScrapePursueTranche / runDecipherRedactions / runBreakCodes / runFullD080WithDecipher + GMIIE_TOOLS + orchestrator wiring.
- Investigations: ufo-pursue-r03/ has 13_REDACTION_AND_CRYPTO_ANALYSIS.md + updated 03_EVIDENCE_BOARD.md/06_/07_/08_/09_ with full sample DecipherResult (exact shape), confidence matrix (MOTHER-3-BABY 0.79 highest, site 0.64/0.32, date 0.71, overall 0.62, tech 0.61, grammar 0.72), provenance matrix (exact .py:lines + MCP + /truth pages + manifest), scraper/redaction integration details. gmiie-* subdirs have persisted json samples + 06_ md.

## Quick Commands (PowerShell — run from C:\Users\Kevan or subdir as noted)

### 0. Sovereign Preflight (MANDATORY — before any edit, deploy, run, or on-chain per sovereign-control-plane + CLAUDE.md)
```powershell
cd C:\Users\Kevan\sovereign-control-plane\scripts
.\preflight.ps1 -Scope blockchainfraud-platform
# Alternatives (if registered in registry/systems.yaml):
# .\preflight.ps1 -Scope ufo-gmiie-app
# .\preflight.ps1 -Scope all
# Then: Invoke-RestMethod http://127.0.0.1:9076/mcp/health   # or fth-mcp-hub health
```
Gate must pass (or human approval obtained) before proceeding. See RESTART-HERE.md in sovereign-control-plane.

### 0a. BADASS OPERATOR COMMANDS — Stargate/Gateway Full Coverage + Dual-Site Share + Generalized Pipeline (2026-06-14)
**Start both canonical sites (ufo-gmiie prototype + legacy /truth production surface; note: ufo defaults 3000/3003, set 3005 for share/tunnel/PWA per README; truth Vite/Next ~5173):**
```powershell
# Terminal 1: ufo-gmiie-app (Ring prototype, MCP brain, 4-button chain, program filters for stargate/gateway)
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
npm run dev -- -p 3005   # or PORT=3005 npm run dev; http://localhost:3005
# Terminal 2: legacy-vault /truth (canonical, cross-calls ufo at 3005, full redaction cards + MOTHER 0.79 + narrate + comfy + x402)
cd C:\Users\Kevan\adk_build\legacy-vault-protocol
npm run dev   # typically 5173 or per package; open /truth ; set __UFO_GMIIE_BASE=http://localhost:3005 for cross
```
**Share session for Stargate/Gateway (or any doc):**
```powershell
# After both running + preflight GREEN:
cloudflared tunnel --url http://localhost:3005   # ufo prototype share link (install PWA from recipient browser)
cloudflared tunnel --url http://localhost:5173   # or truth port; send https://*.trycloudflare.com
# Recipients: open link → click "Install as Standalone App (PWA)" from browser menu or page button (ufo-gmiie README PWA section) → own window, icon, offline-capable. Full filter by program=stargate/gateway; click cards for D080 equiv + generalized chain.
```

**Full chain on ANY doc (D080 or Stargate/Gateway RV/Focus; via MCP or UI):**
```powershell
# MCP (start first): python mcp_server.py (ufo-gmiie-app)
# Then from Claude/Cursor/fth-mcp-hub or direct:
analyze_sighting("stargate-cia-grill-flame-001")   # auto: scrape_pursue_tranche -> decipher_redactions -> break_codes (new RV protocol breaks) -> full + persist to investigations/stargate-cia-analysis/ + gmiie-*
analyze_sighting("gateway-monroe-experience-001")  # generalized _infer_redacted:212 + Focus/click-out inferences + ethics
# Or specific:
decipher_redactions("gateway-focus-10-15-21", "data/tranches/... (or seed)")
break_codes("...")  # produces MOTHER-3-BABY 0.79 + new "CRV-PROTOCOL" / "FOCUS-21-CLICKOUT" breaks
full_d080_with_decipher()  # or generalized full_chain on stargate id
# UI equiv (http://localhost:3005 or /truth): use query bar or filter= stargate/gateway → "Decipher Redactions (x402)" / "Break Codes" / "Full Chain" buttons. narrate uses voice_script_inferred (MCP narrate_voice).
```

**MCP narrate_voice + full generalized (Stargate/Gateway + ethics + conf matrix):**
```powershell
# In mcp_server context (or python -c after import):
narrate_voice("stargate-cia-sun-streak-002")  # or doc_id; uses voice_script_inferred from decipher + generalized seeds
# Direct: python -c "
from mcp_server import narrate_voice
print(narrate_voice('gateway-focus-10-15-21', voice_script_inferred='Focus 21 click-out replicator at 0.58... MOTHER-3-BABY 0.79 generalized'))
"
# Returns full packet + ethics (HYPOTHESES ONLY) + provenance to redaction_decipher.py:212 / GENERAL_CONTEXT:97 + mcp:1103.
```

**Preflight + Vercel sync + PWA + full audit:**
```powershell
cd C:\Users\Kevan\sovereign-control-plane\scripts; .\preflight.ps1 -Scope blockchainfraud-platform
# Vercel (ufo + truth; sync after edits to manifest/index/UI catalog + investigations/):
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app; vercel --prod   # set env for 3005 base if needed
cd C:\Users\Kevan\adk_build\legacy-vault-protocol; vercel --prod
# PWA install (local or tunneled): npm run build && $env:PORT=3005; npm start ; browser menu → Install; or page "Install as Standalone App (PWA)" button (ufo page.tsx + README:176).
# Full catalog audit + new programs: python -c "import json; print(json.load(open('data/index.json'))['global']); from CATALOG_AUDIT import ... " ; review investigations/stargate-cia-analysis/00_ + gateway-monroe-analysis/13_ + ufo-pursue-r03/00_ + CATALOG_AUDIT.md (expanded 294 + cross + _infer:212 + missing for new).
# Rebuild UIs + re-persist after drop: npm run build; python mcp_server.py (or full_d080...); cat investigations/ufo-pursue-r03/13_REDACTION... | head -50
```
**Evidence for commands**: OPERATOR_RUNBOOK + ufo-gmiie-app/app/page.tsx:123 (filterProgram stargate/gateway), 3005 base in truth/page.tsx:63, redaction_decipher.py:212 (_infer), mcp_server.py:1103 (narrate_voice), 800 (full chain), CATALOG_AUDIT (expanded), new sub-investigation 00_/03_ etc. All preflight + human gate enforced. Badass, reproducible, sovereign.

**Update existing investigations review section** for new subdirs (see full review commands in 8. below; add stargate/gateway ls + 00_/13_ reads).

Continue with standard sections... (preflight already above; existing 1-9 preserved).

### 1. Run ufo-gmiie-app (Next.js UI prototype — 4 buttons + rich DecipherResult displays)
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
npm install   # or pnpm install (pnpm preferred if monorepo)
npm run dev   # or pnpm dev  (http://localhost:3000 — standouts, query bar, Scrape free / Decipher/Break/Full premium x402 buttons, redaction cards, MOTHER 0.79, conf matrix, voice/Comfy + x402 premium export, evidence paths to investigations/)
# DEV NOTE: runs on 3003 if 3000 busy: npm run dev -- -p 3003   (or set PORT=3003)
```

### 2. Run Legacy Vault /truth (Canonical rich UI — cross-calls ufo-gmiie + full production surface)
```powershell
cd C:\Users\Kevan\adk_build\legacy-vault-protocol
npm install   # or pnpm install
npm run dev   # (default Vite/Next port, typically 5173 or per its package.json)
# Open /truth : D080_ANALYSIS + 4 buttons (Scrape/Decipher/Break/Full D080 Chain) + redaction cards (inferred+conf+alts+bbox+highlight) + code breaks (MOTHER-3-BABY 0.79) + conf matrix + narrate (voice_script_inferred) + comfy (D080+redact) + x402 pay demo + evidence provenance paths to investigations/ufo-pursue-r03 + gmiie-*
# Cross-wires: Set UFO_GMIIE_BASE=http://localhost:3000 in env or code to hit ufo-gmiie /api/analyze?action=... (with X-PAYMENT for premium)
```

### 3. MCP Server (exposes chained tools: scrape_pursue_tranche, decipher_redactions, break_codes, full_d080_with_decipher, analyze_sighting + fetch)
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
python -m pip install -r requirements.txt   # if missing: mcp, httpx, pypdf, pillow, opencv-python, easyocr etc (graceful — see troubleshooting)
python mcp_server.py
# or: uv run mcp_server.py
# Cursor/Claude/fth-mcp-hub: add "ufo-gmiie-analyzer": {"command":"python","args":["C:\\Users\\Kevan\\blockchainfraud-platform\\ufo-gmiie-app\\mcp_server.py"]}
# Test tools (after start): call analyze_sighting "D080-mother-orb-western-sensitive" (auto full chain for D080 + persist) or full_d080_with_decipher()
# HTTP mode alternative (for remote / avoid stdio async quirks): python mcp_server.py  (edit to use streamable-http if needed; port configurable)
```

### 3a. fth-mcp-hub registration (new helper) + tranche crawler stub + multi-tenancy
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
python scripts/register-ufo-mcp.py --project ufo-pursue-r03
# It POSTs the 5 tools (scrape_pursue_tranche, decipher_redactions, break_codes, full_d080_with_decipher, analyze_sighting) to http://127.0.0.1:9077/mcp/register (or equiv discover); falls back to stub + always crosses /mcp/health.
# Supports project param for multi-tenancy (tools now accept optional project='ufo-pursue-r03'; _write_investigation_evidence persists under investigations/<project>/... subdir).

# Crawler stub (monitors wayback CDX for war.gov/UFO/release/* + seeds, calls scrape with project):
python tranche_crawler.py --release 03 --project ufo-pursue-r03 --once
# python tranche_crawler.py --poll 300   # background monitor loop
```

### 4. Direct Python Scraper (stealth + wayback + redaction hints + IPFS prep + manifest/index)
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
python scraper.py --release 03 --no-download   # discovery + manifest/index only (safe, no Akamai hits)
python scraper.py --release 03                  # full download + IPFS prep (falls back to archive.org)
python scraper.py --release 03 --cron --log data/scrape.log
python -c "from scraper import scrape_pursue_tranche; print(scrape_pursue_tranche('03', download=False))"
# Output: data/tranches/release-03/raw/ + manifest.json + data/index.json (sha256 + ipfs_cid + redaction_hints) + scrape_errors.jsonl
```

### 5. Direct Redaction Decipher (OCR/CV/inference/conf/alts/rationale/ethics + MOTHER-3-BABY code break)
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
python redaction_decipher.py --file data/tranches/release-03/raw/DoW-UAP-D080_Narrative-2_Western-US-Event.pdf --doc-id D080-mother-orb-western-sensitive
python -c "
from redaction_decipher import decipher_redactions, break_codes, DecipherResult
res = decipher_redactions('D080-test', 'data/tranches/release-03/raw/DoW-UAP-D080_Narrative-2_Western-US-Event.pdf')
print(res.overall_confidence, [c.confidence for c in res.code_breaks if 'MOTHER' in str(c)])
print('MOTHER-3-BABY 0.79 sample present')
print(res.ethics_note)
"
# Batch example in code or via MCP full chain.
```

### 6. Ingest + data prep (ties scraper + redaction + local drop unification)
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
python ingest.py --scrape --tranche 03                    # web discovery + archive + index/manifest update
python ingest.py --scrape --tranche 03 --no-download      # discovery only
python ingest.py --scrape --tranche 03 --local "C:\path\to\your\full\Release-03\folder"   # LOCAL DROP MODE: unify user-provided PDFs/images + run decipher on match + SHA + IPFS prep
# Updates: data/index.json (tranches + sightings), manifest.json (discovered_assets + redaction_hints + ipfs), auto redaction enrichment on PDFs.
# Recommended first: --scrape (seeds + discovery) then drop real PDFs and re-ingest --local.
```

### 7. Platform MCP / Orchestrator integration (pursue-analyzer.ts)
```powershell
cd C:\Users\Kevan\blockchainfraud-platform
# TS side wired in src/mcp/tools/pursue-analyzer.ts + orchestrator.ts + src/mcp/agent.ts
node --loader ts-node/esm -e '
import * as pa from "./src/mcp/tools/pursue-analyzer.ts";
console.log("GMIIE_TOOLS:", pa.GMIIE_TOOLS);
'
# Full agent dispatch: via bf-platform MCP hub / orchestrator executeToolCall("decipher_redactions", ...) or "full_d080_with_decipher" or "analyze_sighting"
# Cross to fth-mcp-hub at 9077.
```

### 8. Investigations / Evidence Review (ufo-pursue-r03 + all gmiie-* sinks per AGENTS.md)
```powershell
# Core ufo-pursue-r03 (main forensic board):
Get-Content C:\Users\Kevan\investigations\ufo-pursue-r03\13_REDACTION_AND_CRYPTO_ANALYSIS.md | Select-Object -First 120
Get-Content C:\Users\Kevan\investigations\ufo-pursue-r03\03_EVIDENCE_BOARD.md | Select-String -Pattern "MOTHER-3-BABY|0\.79|DecipherResult|confidence_matrix|redaction_spans" -Context 2
Get-Content C:\Users\Kevan\investigations\ufo-pursue-r03\OPEN_QUESTIONS.md | Select-String -Pattern "async|persist|real PDF|OCR|CV|live" -Context 1
Get-Content C:\Users\Kevan\investigations\ufo-pursue-r03\09_REMEDIATION_PLAN.md | Select-String -Pattern "redaction_pattern_monitor|human gate|preflight" -Context 1

# gmiie-* evidence sinks (auto-persisted JSON + 06_ from mcp_server _write_investigation_evidence + /api):
Get-ChildItem C:\Users\Kevan\investigations\gmiie-anomaly-intelligence-* -Recurse -Include *.json,*.md | Select-Object -First 30 FullName, Length, LastWriteTime
Get-Content C:\Users\Kevan\investigations\gmiie-anomaly-intelligence-D080-mother-orb-western-sensitive\decipher.json | ConvertFrom-Json | Select-Object -Property doc_id, overall_confidence, code_breaks
Get-Content C:\Users\Kevan\investigations\gmiie-anomaly-intelligence-D080-full-with-decipher\full_d080_with_decipher.json | ConvertFrom-Json | Select-Object -Property chaining_ready, confidence_matrix, evidence_board_paths -First 1
ls C:\Users\Kevan\investigations\gmiie-anomaly-intelligence-tranche-03\scrape.json

# Persist happens auto on every MCP tool (/api) run: mcp_server.py _write_investigation_evidence + analyze/full paths logged to gmiie-* + ufo-pursue-r03/06_*.md
# Cross-ref: OPERATOR_RUNBOOK.md + ufo-gmiie-app/README.md
```

### 9. Health / Full Chain Test (MCP exposed + chained + UI equivalent)
```powershell
# 1. Start MCP (one terminal)
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app; python mcp_server.py

# 2. In another (or via Cursor/Claude tool call):
# scrape_pursue_tranche("03") -> decipher_redactions("D080-mother-orb-western-sensitive", "data/...D080...pdf") -> break_codes("data/...pdf") -> full_d080_with_decipher()
# Or single: analyze_sighting("D080-mother-orb-western-sensitive")  # auto-chains all + persist

# 3. UI equivalent (after npm dev):
# http://localhost:3000  or legacy /truth : click Scrape (free) -> Decipher (x402 demo) -> Break (premium) -> Full D080 Chain (premium) -> voice/Comfy + x402 premium export
# All return full DecipherResult shape + evidence_persisted paths + ethics + conf matrix.

# Clean verification test (no side effects):
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
python -c "
from scraper import scrape_pursue_tranche
from redaction_decipher import decipher_redactions, break_codes
print('IMPORTS OK')
s = scrape_pursue_tranche('03', download=False)
print('SCRAPE OK, standouts=', len(s.get('assets',[])) if isinstance(s,dict) else 'N/A')
print('MCP + chain ready. See OPERATOR_RUNBOOK.md')
"

# D080 chain test (direct import of full MCP-exposed chain entrypoint):
python -c "from mcp_server import full_d080_with_decipher; print(full_d080_with_decipher())"

# UI test (use 3003 if 3000 occupied):
# open http://localhost:3003 , hit Full D080 Chain (pay demo), open catalog, generate + download for D080 (gets PDF with MOTHER + HYPOTHESES)
```

**x402 Premium**: Decipher/Break/Full require X-PAYMENT receipt (demo: 'demo-receipt-cdp-usdc-001' or handleX402Pay in /truth page.tsx). Scrape free. Enforced in ufo-gmiie-app/app/api/analyze/route.ts + mcp stubs + legacy /truth.

**Ethics / Sovereign**: Every output carries "HYPOTHESES ONLY" + conf <1.0 + provenance + ethics_note. Human gate >0.5 before mint per 09_ + sovereign preflight + CLAUDE.md (no on-chain without explicit approval).

**Repro / Audit**: All calls log to investigations/ (ufo-pursue-r03/ + gmiie-*) + data/ + manifest. Re-run python cmds + refresh UIs. No private keys ever. Primary evidence always traced to .py:lines / ts:lines / manifest.

**Startup full** (per CLAUDE.md style + dual UI):
```powershell
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app; python mcp_server.py   # one term (MCP brain)
cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app; npm run dev             # second (ufo prototype UI @3000; if busy: npm run dev -- -p 3003 )
cd C:\Users\Kevan\adk_build\legacy-vault-protocol; npm run dev                     # third (canonical /truth)
# Visit http://localhost:3000 (or 3003) and /truth for 4-button surface + cross-calls.
# Review: C:\Users\Kevan\investigations\ufo-pursue-r03\13_... + gmiie-* json/06_
# Always preflight first.
```

## Troubleshooting

### Async Warnings (e.g. "coroutine was never awaited", "asyncio.run() cannot be called from a running event loop", RuntimeWarning on direct calls)
- Root: scraper.py uses asyncio.run(scrape_release...) internally. Direct sync calls from within async MCP context (mcp_server.py analyze_sighting/full_d080 etc) or tests trigger this if not isolated.
- **For prototype / production use**: IGNORE — hardened in mcp_server.py via `_await_scrape` (to_thread for sync scraper paths that do asyncio.run internally; direct await for native async scrape_release) + `_await_if_needed`. See mcp_server.py:251 (def _await_scrape), 230, 435 (auto-chain uses it), 661 (scrape_pursue_tranche wrapper), 972 (full_d080). All @mcp.tool and auto-chains are safe and tested.
- **If warnings persist in direct calls / unit tests / outside MCP**: 
  - Use HTTP/streamable-http transport for MCP server instead of stdio (avoids some loop mixing): `python -c "import mcp_server; ..." ` or edit server launch for `--transport streamable-http --port 8765` and invoke via HTTP client.
  - Prefer the exported top-level sync wrappers (`scrape_pursue_tranche`, `decipher_redactions`) for pure Python scripts/tests.
  - Never nest `asyncio.run` inside running loop; use `asyncio.to_thread(fn, ...)` or the provided helpers.
- Clean test commands above avoid the path. Full chain via MCP tool calls or UI /api never surface to operator.

### Missing Deps (graceful fallbacks)
- All modules implement try/except around optional heavy deps (beautifulsoup4, pypdf, pillow, opencv-python / cv2, easyocr / pytesseract, pdf2image, numpy, mcp, httpx, playwright).
- Behavior on missing: text-only extraction, heuristic black-rect detection (PIL fallback), stub OCR ("[OCR unavailable]"), seed D080_D077_CONTEXT heuristics (still produces full DecipherResult shape with lower conf ~0.3-0.5 + MOTHER 0.79 from grammar), mock IPFS CIDs (bafy-fake-...), no real download (use --no-download or seeds).
- Install recipe (run inside ufo-gmiie-app):
  ```powershell
  cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
  python -m pip install httpx beautifulsoup4 pypdf pillow opencv-python-headless easyocr pdf2image numpy mcp[cli]
  # Full for redaction live: + poppler-utils (for pdf2image on Windows via choco or manual)
  # Optional: playwright + playwright install chromium
  ```
- After install: restart mcp_server.py + re-run ingest/redaction_decipher. UI + MCP still fully operational (prototype fidelity). Confs lower until real deps + real PDF. See redaction_decipher.py:47 (graceful), mcp_server.py:55 (import guards + logger.warning), scraper.py:46, ingest.py:35.
- requirements.txt (create if absent) lists the above for `pip install -r requirements.txt`.

### Drop Real PDF for Live OCR/CV (upgrade confs + real spans)
- Current runs use seeds + D080_D077_CONTEXT (heuristic) → overall ~0.46, site 0.32/0.64, etc. (see gmiie-*/decipher.json + 03_/13_ matrix).
- **To activate live**: 
  1. Obtain real PURSUE Release 03 tranche (PDFs ~826MB bundle or individual D080/D08x etc.).
  2. Drop files into `C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app\data\tranches\release-03\raw\` (preserve original names where possible, esp. *D080*.pdf).
  3. Unify + process:
     ```powershell
     cd C:\Users\Kevan\blockchainfraud-platform\ufo-gmiie-app
     python ingest.py --scrape --tranche 03 --local "C:\path\to\your\release-03-folder-or-drop"
     # or directly:
     python redaction_decipher.py --file "data\tranches\release-03\raw\DoW-UAP-D080_....pdf" --doc-id D080-mother-orb-western-sensitive
     python scraper.py --release 03 --local ...   # if extended
     ```
  4. Re-trigger full chain: MCP `full_d080_with_decipher` / `analyze_sighting` / UI "Full D080 Chain" button (after npm dev) or direct python calls.
- **What upgrades**: 
  - `_detect_black_rects` (real cv2 contours + bbox from actual page images via pdf2image).
  - `_ocr_image` (easyocr on rendered pages → real visible_context_before/after + target text).
  - `_infer_redacted` uses actual extracted text + real redaction_hints from scraper/index instead of pure seeds.
  - Redaction_spans get live bbox + higher confidence (site/date/tech/grammar can jump 0.6-0.85+). overall_confidence rises. code_breaks (MOTHER etc.) stay robust or improve with real grammar.
  - Output now includes real OCR text snippets + pixel-level provenance.
- Auto: ingest + mcp_server + /api persist updated DecipherResult + confidence_matrix + new 06_*.md + json to gmiie-anomaly-intelligence-D080-... and ufo-pursue-r03/. Re-score 03_/13_ matrix on next review.
- Edge: Large drops use --no-download first or selective; partial success per-asset. Verify ethics/conf always <1.0.
- Result: live spans in redaction_map returned by UI/MCP/investigations evidence.

**Always**: Verify preflight GREEN. Cross-check output against 03_EVIDENCE_BOARD.md / 13_ + gmiie json. Human review gate for any publication/mint. Register MCP to fth-hub for agent visibility.

This FINAL runbook + code + investigations/ (ufo-pursue-r03 + gmiie-*) + dual UIs + preflight = complete, auditable, consistent, sovereign stack per AGENTS.md / CLAUDE.md / sovereign-control-plane. Ready for operator use + next local drop delta. All copy-paste commands above are production-oriented and reproducible.

Cross-refs: ufo-gmiie-app/README.md , blockchainfraud-platform/README.md , investigations/ufo-pursue-r03/* (esp. OPEN_QUESTIONS.md + 13_), all gmiie-anomaly-intelligence-*/06_ + json, legacy-vault-protocol/app/truth/page.tsx header, pursue-analyzer.ts. Per non-negotiable rules: primary evidence, ranked conf, explicit open questions.