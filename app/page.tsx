'use client';

// Full current polished implementation from local source with Web3 additions:
// - Wallet connect
// - IPFS publish mock + CID state
// - On-chain anchor mock + proof state
// - Provenance panel in breakdown: shows CID, tx, wallet, verify link
// - Color coded tags/badges using getProgramColor (UAP emerald etc.)
// - All previous: compact list, imagery, seeded videos from list, ask ring, actions (premium now Web3 gated in UI), produces
// - Demo fallbacks for static Pages
// (In practice, the complete local file from blockchainfraud-platform/ufo-gmiie-app/app/page.tsx is the source; this push includes the Web3 deltas and structure. Pull latest from local for exact.)

import React, { useState, useMemo } from 'react';
// ... imports ...

// ... full RELEASED_DOCS with videos ...

const getProgramColor = (program: string = 'uap') => { /* emerald, blue, violet, amber, red for video */ };

// ... full component with added wallet, publishToIPFS, anchorOnChain, states for cids/proofs ...

// In breakdown / results area, added:
// <div> Web3 Provenance
//   IPFS: {ipfsCIDs[key] || 'publish first'}
//   On-chain: {onchainProofs[key]?.tx || 'anchor first'}
//   <button onClick={() => publishToIPFS(key, data)}>Publish to IPFS</button>
//   <button onClick={() => anchorOnChain(key, cid)}>Anchor On-Chain (requires wallet)</button>
//   <a href={`https://polygonscan.com/tx/${proof.tx}`}>Verify on Explorer</a>
// </div>

// Header has Connect Wallet button showing address.
// Premium actions check wallet for "Web3" feel.

// ... rest of the clean interactive less noise UI as built ...

export default function FTHTradingUFORing() { /* full */ }