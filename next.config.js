/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `http://0.0.0.0/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
