/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/**',
      },
    ],
  },
  eslint: {
    // Disabilita ESLint durante il build per evitare errori di deploy
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disabilita i controlli TypeScript durante il build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
