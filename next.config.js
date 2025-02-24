/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/surf-session/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
