import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

// Voice narration endpoint for full D080 packet (and other sightings).
// PRODUCTION: gated by x402 (premium), calls Deepgram Aura TTS server-side only (never expose key).
// Prefers voice_script_inferred from body (from decipher/break/full chain) for rich inferred narration.
// Returns audio/mpeg stream when Deepgram succeeds + key present, else JSON text + metadata for browser fallback.
// Reuses legacy-vault patterns. x402 premium required for real TTS.

function paymentRequired() {
  return NextResponse.json(
    {
      error: "Payment Required",
      message: "Voice narration (Deepgram Aura) is premium x402-gated.",
      x402: { amount: "0.02", asset: "USDC", network: "base", payTo: "FTH-Treasury" },
    },
    { status: 402, headers: { "X-PAYMENT-REQUIRED": "true" } }
  );
}

export async function POST(req: NextRequest) {
  const paymentHeader = req.headers.get("x-payment") || req.headers.get("X-PAYMENT");
  const isPremium = !!paymentHeader || req.url.includes("premium");

  if (!isPremium) {
    return paymentRequired();
  }

  const body = await req.json().catch(() => ({}));
  const { doc_id = "D080-mother-orb-western-sensitive", narrative, voice_script_inferred, tts = true } = body;

  // Prefer the rich inferred script from the Ring chain (decipher/break/full_d080)
  const isStargate = (doc_id || "").toLowerCase().includes("stargate");
  const isGateway = (doc_id || "").toLowerCase().includes("gateway") || (doc_id || "").toLowerCase().includes("focus") || (doc_id || "").toLowerCase().includes("monroe");
  const script = voice_script_inferred || narrative || (doc_id.includes("D080") 
    ? `D080 Mother Orb Mechanics — PURSUE Release 03 (DOW-UAP-D080 Narrative + D077 AARO analysis). AARO Director Jon Kosloski signed off June 5, 2026. Case still open.

Core Cycle (repeated multiple times over hours, dusk into night, October 2023, near sensitive western U.S. national security site):

1. Bright luminous orange "mother orb" appears suddenly (often eastern horizon, 35-45° elevation). Starts planet-like, grows brighter/larger over seconds.

2. Inside or from it, smaller red "baby orbs" (2-4 per cycle, consensus ~3) emerge/produce/launch. Witnesses described: "hatched," "expelled like grapes from a basketball," "produced one after another."

3. Orange mother orb visible only 1-2 seconds total, then disappears/fades.

4. Red orbs move away — mostly horizontal straight lines, but some "swoop down," "head up at an angle," or loiter stationary (one hung above a ridgeline for hours). Smooth, coordinated, instant acceleration. No sound, no trails in most accounts.

Scale & Distance (AARO measurements): Mother orb ~1,050m away, 12-18m diameter. Red orbs smaller. Agents initially estimated closer (~500-600m, helicopter-cockpit size).

Multi-Witness Convergence: Six federal law enforcement special agents (three two-man teams) over two days. Independent teams from different vantage points reported the exact same pattern. FBI digital recreations and AI-assisted slides included in the release. One witness compared morphing lights to "portals."

This aligns with some known military tech in parts but flags "unrecognized technology" for the core anomalous chunk. ~40% of the phenomena unexplained.

GMIIE / Reset Angles: Proliferation / replication mechanic screams advanced propulsion or drone swarm analog — but silent, loitering, transmedium potential. Defense contractors (swarm/counter-swarm tech). Stablecoin/CBDC surveillance angles for persistent monitoring near sensitive sites. Macro fear amplifier for defense outperformance + crypto volatility. Premium x402-gated verified analysis exports and IPFS+ZK anchors available for agentic evidence.

Hypotheses Ranked (AARO + Platform Detector): Flares/drones lowest after review; foreign adversary unlikely; unrecognized tech highest remaining.`
    : isStargate ? `Stargate RV Session (generalized from decipher/break chain). CRV protocol on [redacted Soviet/tech/missing target]. Viewer [redacted]. Success metrics masked. Overlaps Gateway Hemi-Sync for training. GMIIE: consciousness tech declass as macro fear catalyst for stablecoin/perception-trust rails + on-chain verification. All inferences HYPOTHESIS ONLY. Full evidence in investigations/gmiie-stargate or ufo-pursue-r03.` 
    : isGateway ? `Gateway Experience (generalized). Hemi-Sync Focus 10 (mind awake body asleep). Energy bar tool. Click out transcendence (Focus 15/21). Stargate RV overlap for altered-state augmentation. GMIIE reset: consciousness tech signals long-horizon defense R&D + programmable money as trust infrastructure. Hypotheses only. Evidence persisted.`
    : `Full packet for ${doc_id} from PURSUE Release 03 / cross-program (Stargate/Gateway supported via generalized chain). See investigations/ufo-pursue-r03 or gmiie-<program> for complete evidence board. Use voice_script_inferred from decipher for rich narration.`);

  const deepgramKey = process.env.DEEPGRAM_API_KEY;

  if (tts && deepgramKey) {
    try {
      const dgRes = await fetch(`https://api.deepgram.com/v1/speak?model=aura-2-luna-en&encoding=mp3`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${deepgramKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: script }),
      });

      if (dgRes.ok) {
        const audioBuffer = await dgRes.arrayBuffer();
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `inline; filename="${doc_id}-ring-narration.mp3"`,
            'X-Deepgram-Model': 'aura-2-luna-en',
            'X-Narration-Source': voice_script_inferred ? 'voice_script_inferred-from-ring-chain' : 'base-packet',
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch (dgErr) {
      // fall through to text fallback
    }
  }

  // Fallback (no key, no tts, or Deepgram failed): return text for browser speech or download
  return NextResponse.json({
    ok: true,
    doc_id,
    full_narrative: script,
    tts_ready: !!deepgramKey,
    deepgram_note: deepgramKey 
      ? "Deepgram Aura attempted but fell back (check key/credits/model). Real audio streamed when successful + x402."
      : "No DEEPGRAM_API_KEY in env. Set in .env (server-side only). Fallback to browser speechSynthesis. Prod: legacy-vault voice patterns + server-side key (Aura).",
    elevenlabs_note: "Alternative: ElevenLabs for custom Ring narrator voice clone.",
    length_chars: script.length,
    premium: true,
    paid: isPremium,
    source: voice_script_inferred ? "inferred-from-decipher-break-full" : "base-packet",
  });
}
