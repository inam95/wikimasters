import { dirname } from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.BLOB_BASE_URL}/**`)],
  },
  reactCompiler: true,
  turbopack: {
    root: dirname(__filename),
  },
};

export default nextConfig;
