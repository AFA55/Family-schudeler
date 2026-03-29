/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@familysync/shared", "@familysync/database"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
