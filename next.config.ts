import type { NextConfig } from "next";

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  // Disable caching in development for better hot reloading
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config: any, { dev }: any) => {
      if (dev) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),
};

export default withNextIntl(nextConfig);
