import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },
  // Make sure images from OpenAI and placeholder.com are allowed
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net',
      'via.placeholder.com'
    ],
  },
};

export default nextConfig;
