/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'play10.tikast.com',
        port: '2197',
        pathname: '/static/larumbera/covers/**',
      },
      {
        protocol: 'https',
        hostname: 'play10.tikast.com',
        port: '2197',
        pathname: '/static/larumbera/covers/**',
      },
      {
        protocol: 'https',
        hostname: 'larumbera.xyz',
        pathname: '/back/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        pathname: '/image/thumb/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    NEXT_PUBLIC_WORDPRESS_SITE_URL: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL, // Asegúrate de definir esta variable en .env.local si la usas
  },
};

module.exports = nextConfig;