import "server-only"

export const BACKEND_CONFIG = {
  apiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
  masterDataApiUrl:
    process.env.MASTERDATA_BACKEND_API_URL || "http://localhost:8001",
  appMnemonic: process.env.APP_MNEMONIC || 'registry-ui',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
};
