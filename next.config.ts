import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Setările tale actuale din Next.js (dacă aveai)
};

export default nextConfig;

// Gives `next dev` access to the D1/R2 bindings declared in wrangler.toml
// (via Miniflare) — without this, getCloudflareContext() hangs indefinitely
// on every DB-backed route in local dev.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();