import { configCloudflare } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Setările tale actuale dacă ai (ex: images, rute etc.)
};

// Îi pasăm un obiect de configurare în care definim target-ul ca fiind cloudflare-pages
export default configCloudflare(nextConfig, {
  target: 'cloudflare-pages'
});