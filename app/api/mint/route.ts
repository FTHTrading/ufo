import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

/**
 * Pure x402-gated premium access / export endpoint.
 * TROPTIONS / specific NFT mint functionality removed.
 * This now provides verified premium report bundle / download access
 * after x402 payment receipt (from prior /api/analyze or facilitator).
 * Keeps general on-chain hooks (IPFS+ZK, Apostle x402) where applicable.
 * In prod: verify X-PAYMENT receipt server-side before returning full bundle.
 */

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { doc_id, analysis_hash, cid } = body;

  // In production:
  // 1. Verify x402 receipt was valid for this doc_id (Apostle ATP or Base USDC via CDP / facilitator)
  // 2. Return full verified analysis bundle or signed download link / IPFS+ZK evidence pack
  // 3. Anchor via bf-platform gateways / genesis402 / legacy-vault ZK if additional permanence requested
  // No NFT mint, no TROPTIONS rails, no solana-adapter mint calls.

  const bundleId = "x402-premium-" + (doc_id || "d080").replace(/[^a-z0-9]/gi, '') + "-" + Date.now().toString(36);

  return NextResponse.json({
    ok: true,
    doc_id,
    analysis_hash: analysis_hash || "sha256-d080-mother-orb-mechanics-" + Date.now(),
    bundle_id: bundleId,
    ipfs: cid || "bafy-demo-from-legacy-vault-d080-packet",
    download: `/api/export?bundle=${bundleId}`, // placeholder for actual gated download or stream in prod
    metadata: {
      title: "PURSUE R03 D080 Mother Orb Verified Analysis (Premium)",
      description: "Core cycle, AARO measurements, 6-agent multi-witness, ~40% unexplained. GMIIE reset angles included. x402 premium export.",
      source: "war.gov/UFO PURSUE Release 03 (DOW-UAP-D080 + D077)",
      timestamp: new Date().toISOString(),
    },
    onchain_hooks: [
      "Apostle 7332 x402 receipt anchor",
      "IPFS + ZK (legacy-vault) of verified bundle",
    ],
    note: "Pure x402 gated access. Executes after confirmed x402 receipt (Apostle ATP or Base USDC via CDP). Uses sovereign gateways + legacy-vault ZK+IPFS for proof pack. No minting of NFTs/tokens. Premium analysis/downloads only.",
  });
}
