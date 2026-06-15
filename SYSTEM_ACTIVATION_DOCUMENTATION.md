# GMIIE UFO Truth Surface: Full System Activation & Architecture Documentation

This document serves as the canonical system reference and verification manual for the **GMIIE UFO Anomaly Intelligence Truth Surface**. It bridges the gap between the static client-side demo surface (deployed at `https://ufo.xxxiii.io/`) and the full sovereign agentic backend running locally or on dedicated infrastructure.

---

## 1. System Architecture & Runtime Boundaries

The GMIIE UFO Anomaly Intelligence platform uses a hybrid runtime architecture. When hosted publicly on static environments (such as GitHub Pages), the system operates in **Sovereign Demo Mode** to bypass inaccessible backend server endpoints, serving rich client-side mocked data immediately and safely. When deployed locally or on sovereign cloud hosting, it connects directly to the off-chain Python FastMCP backend.

### Component Diagram

```mermaid
graph TD
  User((Public User)) -->|Interacts| UI[GMIIE Truth Surface UI]
  UI -->|Check Hostname / hostname.includes| Router{isStaticDemo || DEMO_BACKEND}
  
  Router -->|True / Static Demo| Simulation[Client-Side Simulation Fallbacks]
  Router -->|False / Production| API[Next.js Server API Endpoints /api/*]
  
  Simulation -->|Instant Mock Render| Result[Inline Query Results / Side Drawer]
  Simulation -->|Mock txt File| LocalDownload[Client-side TXT Report Download]
  
  API -->|Proxy requests| MCPServer[Python FastMCP mcp_server.py]
  MCPServer -->|Retrieve raw tranches| Ingest[ingest.py / tranche_crawler.py]
  MCPServer -->|Trigger OpenCV/OCR| Decipher[redaction_decipher.py]
  MCPServer -->|Generate Watermarked PDF| PDFGen[Python ReportLab PDF Factory]
  MCPServer -->|Settle Web3 / x402| Blockchain[On-chain Proof Registry Base/Solana]
```

### Runtime Modes

1. **Sovereign Demo Mode (`DEMO_BACKEND = true`)**:
   - Activated automatically in-browser for hostnames containing `github.io` or `xxxiii.io`.
   - Short-circuits all `/api/*` requests client-side to prevent network failures (`404` HTML responses throwing `SyntaxError` on JSON parsing).
   - Simulates wallet connection states (MetaMask provider checking + mock simulation).
   - Serves declassified tranches directly from the client-side `RELEASED_DOCS` dictionary.
2. **Sovereign Local Mode (`DEMO_BACKEND = false`)**:
   - Designed for local execution (`localhost:3005`) connected to the python FastMCP server.
   - Proxies query requests to the live `mcp_server.py` executing OCR/CV decipher scripts.
   - Triggers real on-chain transaction anchors for declassified document hashes.

---

## 2. Public Product Manual (UI Surface Guide)

The public surface consists of several interconnected panels designed to guide the user from high-level anomaly sightings down to low-level forensic evidence:

* **Header Controls**:
  * **Connect Wallet (Web3)**: Opens the Web3 Connection modal. Detects MetaMask provider injection and offers a "Sovereign Demo Mode (Simulate Connect)" mock address injection (`0x6551...230c`) to simulate signature hooks.
  * **Forensic Board**: Copies the local investigation directory path (`C:\Users\Kevan\investigations\ufo-pursue-r03`) to the user's clipboard.
  * **Legacy Truth**: Dynamically targets the deployed canonical contract platform at `https://legacychain.app/truth` when run on static pages.
* **Ask the Ring Query Section**:
  * Contains the main NLP input area. Clicking **Ask the Ring** renders an inline results panel immediately below the input.
  * Displays a loading pulse state (`Analyzing PURSUE Tranches via Ring...`) followed by an inline glassmorphic results card featuring:
    * The resolved intelligence packet title.
    * An AI-composed summary.
    * A confidence percentage.
    * Direct buttons mapping to referenced catalog documents to open them in the side drawer.
* **Declassified Timeline**:
  * A horizontal scrolling panel containing chronologically ordered historical incidents (e.g. 1949 Army Flying Saucer study, 1969 Apollo 11 audio debrief).
  * Clicking **Analyze Event** on any timeline card automatically aligns the catalog filters, selects the targeted document, and triggers the inline query engine.
* **Catalog Explorer**:
  * Exposes table and grid layouts for all 40 declassified items in the manifest.
  * Supports real-time search, release tranche filters (`Tranches 01-03`), status filters, and program plane tabs (`STARGATE`, `GATEWAY`, `UAP`, `HISTORICAL`).
  * Features a robust **stale filter warning empty-state** showing a warning icon and a one-click **"Reset Filters"** button if search criteria yields 0 matches.
* **Agentic Operations Control Center**:
  * Shows the status of the three autonomous agents (`Agent Aether`, `Agent Cipher`, `Agent Oracle`).
  * Provides direct manual pipeline triggers (`Trigger Scrape`, `Trigger Decipher`, `Break Codes`, `Full D080 Chain`).

---

## 3. API Reference & Schemas

On static hosting, these APIs are intercepted by the client-side router. For local and sovereign production hosting, the Next.js API endpoints accept and return the following schemas:

### 3.1 `POST /api/analyze`
Executes RAG, scrapes, or triggers OCR/decipher algorithms on target documents.
* **Request Payload**:
  ```json
  {
    "doc_id": "uap-d080-mother-orb-western",
    "query": "decipher redactions D080",
    "action": "decipher_redactions",
    "tranche": "03"
  }
  ```
* **Response Payload (Decipher Action)**:
  ```json
  {
    "ok": true,
    "doc_id": "uap-d080-mother-orb-western",
    "redaction_map": [
      { "redacted_text": "████████", "inferred_text": "Groom Lake Base", "explanation": "Sensitive facility location code" }
    ],
    "code_breaks": [
      { "code_symbol": "MOTHER-3-BABY-CYCLE", "interpretation": "Sub-entity separation cycles", "confidence": 0.79 }
    ],
    "inferred": "Luminous orange mother orb expelling smaller red baby orbs...",
    "confidence_overall": 0.81
  }
  ```

### 3.2 `POST /api/download`
Downloads the target declassified document with ZK proof indicators and decipher overlays.
* **Request Payload**:
  ```json
  {
    "doc_id": "stargate-cia-grill-flame-rv-protocols-001",
    "title": "Grill Flame Remote Viewing Protocols"
  }
  ```
* **Response**: Binary PDF file stream. Falls back to a client-side simulated `TXT` file download on static hostnames.

### 3.3 `POST /api/voice`
Generates Text-to-Speech audio files using Deepgram API.
* **Request Payload**:
  ```json
  {
    "doc_id": "gateway-monroe-hemi-sync-focus-levels-001"
  }
  ```
* **Response**: Binary audio stream (`audio/mpeg`). Falls back to browser Web Speech API client-side in static demo environments.

---

## 4. Agent Operations Manual

The platform is monitored and driven by three specialized, autonomous agents:

```
┌─────────────────────────────────────────────────────────────┐
│                   Ingestion & Feed Agent                    │
│                        AGENT AETHER                         │
├─────────────────────────────────────────────────────────────┤
│ • Scrapes FOIA rooms, FBI Vault, and military release links.│
│ • Validates document hashes and metadata schemas.           │
│ • Populates the live anomaly feed and catalog tranches.     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Decryption & Analysis Agent                 │
│                        AGENT CIPHER                         │
├─────────────────────────────────────────────────────────────┤
│ • Deciphers redacted blackouts using text-grammars.         │
│ • Runs OpenCV/OCR processing on declassified charts.        │
│ • Extracts steganographic codes (e.g. MOTHER-3-BABY-CYCLE). │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Settlement & Provenance Agent                  │
│                        AGENT ORACLE                         │
├─────────────────────────────────────────────────────────────┤
│ • Moniters Web3 wallets & processes x402 stablecoin logic.   │
│ • Registers sha256 document anchors onto the public ledger. │
│ • Generates cryptographic receipts for vault access.        │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Data Provenance & Evidence Packaging

Every document card in the catalog points to its verified origin:
* **CIA Records**: Monroe Hemi-Sync and Grill Flame Remote Viewing protocols reference the official **CIA Electronic Reading Room** FOIA releases.
* **FBI Records**: Colorado Springs 2022 sightings and similar reports point directly to the **FBI Vault (The Vault)**.
* **Defense Studies**: Historical aerospace records point to the **AARO (All-domain Anomaly Resolution Office)** unresolved folders and national security registries.

### Evidence File Package Structure
When exporting evidence packets, the system packages:
1. `sha256` hash of the raw declassified document.
2. The `redaction_map` showing blacked-out text and inferred translations.
3. The `code_breaks` listing steganographic symbols and confidence metrics.
4. An on-chain proof reference (transaction hash + network registry).

---

## 6. Blockchain & IPFS Verification

The blockchain layer ensures the integrity and immutable registration of anomaly reports:
* **IPFS Anchoring**: Artifact files are compiled, hashed into a `bafybei` Content Identifier (CID), and simulated as uploaded to IPFS. This makes the evidence immutable and content-addressable.
* **On-Chain Proofs**: Once IPFS publishing completes, the CID is anchored to the public registry.
  * In static demo mode, it generates a simulated transaction hash (e.g., `0x7b23...70`) and links it to the active mock wallet address.
  * In production, the transaction is registered via the Web3 provider on Solana, Polygon, or the private Apostle Chain.

---

## 7. Incident, Error-State, & Fallback Guide

To guarantee zero UI breakage, the following fallbacks are hardcoded in the frontend layout:

| Trigger Action | Failed State | Fallback Logic | User Feedback |
|---|---|---|---|
| **Ask the Ring** | Network Down / Static Pages | Client-side routing to `getDemoResult` parsing the query for keywords. | Toast: `Demo Ring Analysis (static GitHub Pages)` |
| **Decipher Redactions** | Server API Unavailable | Client-side mock decipher mapping for Stargate, Gateway, or UAP records. | Toast: `Redaction decipher complete` (with simulated details) |
| **Download PDF** | No Server-side Report Factory | Client-side construction of a `.txt` file containing the declassified record logs. | Toast: `Demo report downloaded (static GitHub Pages)` |
| **Audio Voice TTS** | Deepgram API Key Missing | Web Speech API (`window.speechSynthesis`) fallback inside the browser. | Toast: `Using browser speech fallback` |
| **Connect Wallet** | No MetaMask Extension | Enables "Sovereign Demo Mode" simulator button inside the Web3 connection modal. | Toast: `Sovereign wallet mock connection established` |

---

## 8. Capability Validation Report

Every critical feature on the truth surface has been validated against Next.js production compilers:

| Capability | Test Target | Status | Verification Method |
|---|---|---|---|
| **Query Engine** | `#query-section` inline results panel | **Operational** | Entered text queries and confirmed inline card rendering. |
| **Horizontal Timeline** | Scroll component + document selection | **Operational** | Clicked timeline buttons and checked active filters. |
| **Catalog Explorer** | Filters + search + stale filter empty states | **Operational** | Filtered to empty results and verified "Reset Filters" CTA. |
| **TypeScript Safety** | Static type checking | **Verified** | Passed `npx tsc --noEmit` with zero errors. |
| **Static Compilation** | Production static export | **Verified** | Next.js output successfully exported to `./out` folder. |
| **Static Host Fallbacks** | Short-circuit routing | **Operational** | Tested public URLs and verified zero HTML SyntaxError console crashes. |

---

*This document is verified and signed for the GMIIE UFO Anomaly Intelligence Surface.*
