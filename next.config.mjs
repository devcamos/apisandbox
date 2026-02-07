/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  // Prisma optimization for Vercel (Next.js 16+)
  serverExternalPackages: ['@prisma/client'],
  // Required for Docker standalone run (staging/production container)
  output: 'standalone',
};

export default nextConfig;

