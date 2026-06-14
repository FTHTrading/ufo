import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/ufo' : '',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Static GitHub Pages build for FTHTrading/ufo public demo.
  // Full agentic backend (Python scraper, redaction_decipher, MCP tools, x402 PDFs) runs locally or on sovereign infra.
  // Connect via UFO_GMIIE_BASE env or self-host the Ring for live analysis.
};

export default nextConfig;