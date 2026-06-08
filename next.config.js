/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from common CDNs for vehicle photos
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // Twilio SDK uses Node APIs — keep it server-side only
  experimental: {
    serverComponentsExternalPackages: ["twilio"],
  },
};

module.exports = nextConfig;
