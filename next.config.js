/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimize performance
  poweredByHeader: false,
  compress: true,
  // Reduce JavaScript execution time
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
