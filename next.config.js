/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This lets Netlify builds succeed even if there are ESLint warnings/errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
