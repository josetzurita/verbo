import type { NextConfig } from "next";

// Static export: the site is served as plain files (Cloudflare Pages), so no
// Node server or hosted image optimizer is needed. See lib/image-loader.ts.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
