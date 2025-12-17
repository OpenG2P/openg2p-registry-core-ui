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
  // Webpack configuration for local ESM package
  webpack: (config) => {
    const packagePath = path.resolve(__dirname, '../OpenG2P/openg2p-react-widgets');
    
    // Point alias to package root - webpack will use package.json main/module fields
    config.resolve.alias = {
      ...config.resolve.alias,
      '@openg2p/registry-widgets': packagePath,
    };
    
    // Ensure webpack can resolve ESM modules and follows symlinks
    config.resolve.mainFields = ['module', 'main', 'browser'];
    config.resolve.symlinks = true;
    
    return config;
  },
};

export default nextConfig;
