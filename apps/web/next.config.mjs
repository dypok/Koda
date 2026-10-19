/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@koda/types'],
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
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
