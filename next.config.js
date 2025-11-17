/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // garante imagens locais
  },
  experimental: {
    typedRoutes: false, // evita bug de rota com imagem
  },
};

module.exports = nextConfig;
