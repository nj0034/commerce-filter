/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ['trdst.hgodo.com'],
    loader: 'default',
    path: 'https://trdst.hgodo.com/'
  }
}

module.exports = nextConfig
