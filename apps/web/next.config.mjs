/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tout /api/* est proxifié vers le microservice FastAPI (same-origin:
  // pas de CORS, les cookies de session passent en clair entre les deux).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://127.0.0.1:8100"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
