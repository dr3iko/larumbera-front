/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'emitimosnoticias.com', // <-- AÑADIDO
        port: '',
        pathname: '/back/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'larumbera.xyz',
        port: '',
        pathname: '/back/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'play10.tikast.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
