/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // The source plates are large (up to 5376px). AVIF first, WebP as the
    // fallback — Next resizes and re-encodes on demand, so the originals
    // never reach a browser.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048, 2560],
  },
};

export default nextConfig;
