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
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'pg',
  ],
  // Required for Docker standalone run (staging/production container)
  output: 'standalone',
  // Next.js 16 file tracing can omit Prisma engine binaries; include them explicitly.
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;

