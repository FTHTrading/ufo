import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ufo',
  assetPrefix: '/ufo/',
  images: {
    unoptimized: true,
  },
  // For GitHub Pages project site
};
export default nextConfig;