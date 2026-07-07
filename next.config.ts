import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Adaugă această linie aici pentru OpenNext în producție:
  output: 'standalone',
  
  turbopack: {
    root: __dirname,
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;