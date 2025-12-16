import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Transpile the local package
  transpilePackages: ['@openg2p/registry-widgets'],
  // Use webpack for better local package support (required for local file dependencies)
  webpack: (config, { isServer }) => {
    // Resolve the local package correctly - point to package root
    // Path matches the package.json dependency: "file:../OpenG2P/openg2p-react-widgets"
    // Note: Using correct casing (OpenG2P) for cross-platform compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      '@openg2p/registry-widgets': path.resolve(__dirname, '../OpenG2P/openg2p-react-widgets'),
    };
    return config;
  },
};

export default nextConfig;
