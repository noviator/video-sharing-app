/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.pngall.com', 'lh3.googleusercontent.com'], // this is the website from which the user photo png is used (inside sanity user profile)
  },
}

module.exports = nextConfig
