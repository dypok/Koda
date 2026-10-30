/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@koda/types'],
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon.png).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' blob: data: https:; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* https://*.supabase.co wss://*.supabase.co https://koda.academy https://*.koda.academy; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const apiTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:4000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiTarget}/api/v1/:path*`,
      },
      {
        source: '/curso/:course/seccion/:section',
        destination: '/app/curso/:course/seccion/:section',
      },
      {
        source: '/curso/:course',
        destination: '/app/curso/:course',
      },
      {
        source: '/modulo/:section',
        destination: '/app/curso/python-1/seccion/:section',
      },
      {
        source: '/modulos/:section',
        destination: '/app/curso/python-1/seccion/:section',
      },
      {
        source: '/app/modulo/:section',
        destination: '/app/curso/python-1/seccion/:section',
      },
      {
        source: '/app/modulos/:section',
        destination: '/app/curso/python-1/seccion/:section',
      },
    ];
  },
};

export default nextConfig;
