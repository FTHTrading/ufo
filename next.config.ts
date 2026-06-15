import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ufo',
  assetPrefix: '/ufo/',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Static GitHub Pages build for FTHTrading/ufo public demo (Web3 hybrid).
  // Image refs use /ufo/images/... . Full agentic backend runs sovereign-side.
};

export default nextConfig;
