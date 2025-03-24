import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "http://your-production-api.com",
  },
};

export default nextConfig;
