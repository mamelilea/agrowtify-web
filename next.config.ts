import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["encrypted-tbn0.gstatic.com", "via.placeholder.com", 'ik.imagekit.io', "i.postimg.cc", "postimg.cc"],
  },
};

export default nextConfig;
