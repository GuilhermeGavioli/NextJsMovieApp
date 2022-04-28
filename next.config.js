module.exports = async (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
      /* config options here */
      images: {
        domains: ['upload.wikimedia.org', 'lh3.googleusercontent.com'],
      }
    }
    return nextConfig
  }