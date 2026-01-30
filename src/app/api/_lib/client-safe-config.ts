
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
