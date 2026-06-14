import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { action, doc_id = 'D080-mother-orb-western-sensitive', query = '', tranche = '03' } = body;

  if (action === 'catalog') {
    // Return the seeded + dynamic list (client falls back to RELEASED_DOCS)
    return NextResponse.json({ full_catalog: [], note: 'See RELEASED_DOCS in page.tsx for the 35+ seeded + videos from user list.' });
  }

  // Demo responses for static Pages (real logic in sovereign/MCP/Python). Keeps UI alive.
  const isVideo = String(doc_id).includes('video');
  const isStargate = String(doc_id).includes('stargate');
  const isGateway = String(doc_id).includes('gateway');

  const demo = {
    ok: true,
    doc_id,
    tranche,
    title: isVideo ? 'Seeded Video Reference' : (isStargate ? 'Stargate RV Protocol' : (isGateway ? 'Gateway Experience' : 'UAP D080 Event')),
    explanation: `Agentic demo packet for ${doc_id}. ${query ? 'Query: '+query.slice(0,120) : ''} — HYPOTHESES ONLY. Full decipher, code breaks, voice, Comfy, x402 PDF, IPFS+on-chain provenance require the Ring (local or sovereign). Mother orb / plasma / cloaking / Stargate / Gateway mechanics cross-ref to finance/reset angles.` ,
    phenomenology: isVideo ? ['plasma','merge'] : (isStargate ? ['RV','viewer redacted'] : ['orb cycle','sensitive site']),
    patterns_detected: ['replication','low observable','multi-witness'],
    finance_ties: ['defense contractor exposure','stablecoin rails implications'],
    reset_angles: ['macro fear catalyst','on-chain verification'],
    onchain_hooks: ['x402 receipt','IPFS anchor','provenance tx stub'],
    confidence: 0.76,
    premium_unlocks: ['decipher map','0.79 MOTHER code break','signed PDF','voice','IPFS+onchain'],
  };

  return NextResponse.json(demo);
}
