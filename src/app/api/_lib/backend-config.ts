import "server-only";

//backend configuration (use in API routes)
export function getBackendConfig() {
  return {
    backendApiUrl: process.env.BACKEND_API_URL ?? "",
    masterdataBackendApiUrl: process.env.MASTERDATA_BACKEND_API_URL ?? "",
    appMnemonic: process.env.APP_MNEMONIC ?? "",
    appUrl: process.env.APP_URL ?? "",
  };
}

// Client-safe configuration (use in layouts to pass to client)
export function getClientSafeConfig() {
  return {
    appMnemonic: process.env.APP_MNEMONIC ?? "",
    partnerImportExportEnable:
      process.env.PARTNER_IMPORT_EXPORT_ENABLE === "true",
    verifyServiceUrl: process.env.VERIFY_SERVICE_URL ?? "",
    vpClientId: process.env.VP_CLIENT_ID ?? "",
    vpPresentationId: process.env.VP_PRESENTATION_ID ?? "",
    vpPurpose: process.env.VP_PURPOSE ?? "",
    partnerIngestUrl: process.env.PARTNER_INGEST_URL?? "",
  };
}
