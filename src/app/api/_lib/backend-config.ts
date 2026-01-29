import "server-only"

// Helper to get master data API URL with proper fallback
function getMasterDataApiUrl(): string {
  return (
    process.env.MASTERDATA_BACKEND_API_URL || 
    process.env.MASTER_API_URL || 
    "http://localhost:8001"
  );
}

export const BACKEND_CONFIG = {
  apiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
  get masterDataApiUrl() {
    return getMasterDataApiUrl();
  },
  appMnemonic: process.env.APP_MNEMONIC || 'registry-ui',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
};
