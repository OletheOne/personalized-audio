import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  reactStrictMode: true,
  transpilePackages: ["@pa/ui", "@pa/application", "@pa/contracts", "@pa/config"],
};

export default nextConfig;
