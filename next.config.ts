import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/ufo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ufo/' : '',
  images: {
    unoptimized: true,
  },
};
export default nextConfig;