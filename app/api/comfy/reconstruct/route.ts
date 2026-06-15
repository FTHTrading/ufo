import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

/**
 * POST /api/comfy/reconstruct
 * Dedicated ComfyUI reconstruction hook for the GMIIE Ring (D080 and other sightings).
 * Takes sighting details or doc_id, returns production-ready prompt + metadata.
 * In prod: POST the prompt to your ComfyUI / Gradio endpoint (local or hosted) via MCP tool or direct.
 * Returns the exact prompt tuned to the D080 mother orb cycle (or general).
 */

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { doc_id = "D080-mother-orb-western-sensitive", custom_description, deciphered_description, redaction_notes, voice_script_inferred, conf } = body;

  let prompt: string;
  let title: string;

  const isStargate = (doc_id || "").toLowerCase().includes("stargate");
  const isGateway = (doc_id || "").toLowerCase().includes("gateway") || (doc_id || "").toLowerCase().includes("focus") || (doc_id || "").toLowerCase().includes("monroe");

  // D080 cycle base (core mechanics, used for all inferred/deciphered scenes + redaction-augmented visuals)
  const d080CycleBase = `Photorealistic bright luminous orange "mother orb" (12-18m diameter, ~1,050m distance per AARO) suddenly appearing at 35-45° eastern horizon at dusk over remote desert sensitive national security site, growing brighter and larger over seconds, then inside or from it 2-4 smaller red "baby orbs" (hatched/expelled like grapes from a basketball, produced one after another) launching in coordinated horizontal straight lines, some swooping down or heading up at angles or loitering stationary above a ridgeline for hours. Smooth instant acceleration, no sound, no trails. Six federal law enforcement special agents (three two-man teams) as multi-witnesses from different vantage points over two days, October 2023. FBI digital recreations and AI-assisted slides, AARO unresolved case (~40% unexplained, Director Jon Kosloski sign-off June 5 2026), "unrecognized technology" flag. One witness described morphing lights like "portals". Cinematic, high detail, thermal overlay, multi-witness forensic sketch style in foreground, low observable characteristics, portal-like morphing, 8k --ar 16:9 --stylize 250`;

  // Stargate / Gateway generalized bases for RV + Focus visuals (wired to generalized scripts from mcp / route / pursue-analyzer)
  const stargateBase = `Cinematic declass forensic reconstruction: CIA remote viewer in dim room, coordinate remote viewing (CRV) map and perceptual sketches of [redacted Soviet / technical target], Gateway Hemi-Sync overlay waves, redacted stamps, subtle psychic energy fields, thermal / aura forensic style, 8k --ar 16:9`;
  const gatewayBase = `Cinematic forensic reconstruction of Gateway Experience: subject reclined in Hemi-Sync chair with focus-level energy fields (Focus 10 mind-awake-body-asleep, energy bar tool navigation, click-out portal to non-physical), Monroe Institute + CIA stamps, Stargate RV training overlap, ethereal spacetime folds, thermal / consciousness aura overlays, 8k cinematic --ar 16:9`;

  // Enhanced for decipher redaction/code-break: generate prompts for deciphered/inferred scenes using the D080 cycle + redaction notes (per task) + generalized for program
  const baseDecipher = deciphered_description || redaction_notes || "";
  if (baseDecipher) {
    title = `Deciphered / Inferred Scene — ${doc_id} (${isStargate ? "Stargate RV" : isGateway ? "Gateway Focus" : "D080 Cycle"} + Redaction Notes)`;
    const redactionAug = redaction_notes ? ` Redaction notes / inferred fills: ${redaction_notes}. ` : "";
    const confNote = conf ? ` (inference conf ${Math.round((conf || 0.58) * 100)}%)` : "";
    const base = isStargate ? stargateBase : (isGateway ? gatewayBase : d080CycleBase);
    prompt = custom_description || `${base}. DECIPHERED / INFERRED scene augmentation from redaction map + code breaks${confNote}: ${baseDecipher}. ${redactionAug}Program-specific overlays preserved + thermal/forensic. Legacy /truth + Comfy MCP + mcp_server analyze_any_doc ready. --ar 16:9`;
  } else if (doc_id.includes("D080") || doc_id.includes("mother")) {
    title = "D080 Mother Orb + Baby Orbs Visual Reconstruction (D080 Cycle + Redaction Ready)";
    prompt = custom_description || d080CycleBase;
  } else if (isStargate) {
    title = "Stargate RV Visual Reconstruction (Generalized RV + Gateway Overlap + Redaction Ready)";
    prompt = custom_description || stargateBase;
  } else if (isGateway) {
    title = "Gateway Experience Visual Reconstruction (Focus Levels / Click-Out + Stargate Overlap + Redaction Ready)";
    prompt = custom_description || gatewayBase;
  } else {
    title = "PURSUE Anomaly Visual Reconstruction";
    prompt = custom_description || `High detail cinematic reconstruction of PURSUE UAP sighting: anomalous orb phenomena near sensitive site, multi-witness law enforcement accounts, AARO analysis elements, plasma-like behaviors, cloaking/irregular shapes. Forensic style with witness overlays, thermal, 8k.`;
  }

  // In prod MCP/Comfy integration: 
  // const comfyResponse = await fetch(process.env.COMFY_ENDPOINT || 'http://localhost:8188/prompt', { method: 'POST', body: JSON.stringify({ prompt, ... }) });

  return NextResponse.json({
    ok: true,
    doc_id,
    title,
    prompt,
    usage: "Copy prompt into your local ComfyUI (or Gradio). For agentic: expose as MCP tool 'comfy_reconstruct' in mcp_server.py or pursue-analyzer. Hook to Sovereign Cockpit / Cursor. Supports deciphered_description + redaction_notes + D080 cycle blending for /truth page inferred scenes.",
    metadata: {
      source: "PURSUE Release 03 D080 mechanics (DOW-UAP-D080 + D077) + redaction_decipher.py outputs",
      aaro_details: "12-18m mother, 1,050m distance, 6 agents, 40% unexplained",
      gmii_angles: "swarm tech, surveillance, macro fear, on-chain verification",
      d080_cycle_used: true,
      redaction_notes_integrated: !!baseDecipher,
      voice_script_ready: !!voice_script_inferred,
    },
    next: "Call from legacy /truth page button (or ufo-gmiie page after decipher) for auto visual generation on payment. Chain: analyze(decipher) -> comfy(reconstruct with redaction_notes) -> render.",
    decipher_integration: "Prompt explicitly incorporates D080 cycle base + provided redaction_notes / inferred_text / code break semantics."
  });
}
