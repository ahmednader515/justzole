import type { NextConfig } from "next";
const config: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "26mb" } },
};
export default config;
