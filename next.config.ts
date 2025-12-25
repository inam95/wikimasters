import { dirname } from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: dirname(__filename),
  },
};

export default nextConfig;
