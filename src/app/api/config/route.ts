import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        backendApiUrl: process.env.BACKEND_API_URL ?? "",
        masterdataBackendApiUrl: process.env.MASTERDATA_BACKEND_API_URL ?? "",
        appMnemonic: process.env.APP_MNEMONIC ?? "",
        appUrl: process.env.APP_URL ?? "",

        partnerImportExportEnable:
            process.env.PARTNER_IMPORT_EXPORT_ENABLE === "true",

        verifyServiceUrl: process.env.VERIFY_SERVICE_URL ?? "",
        vpClientId: process.env.VP_CLIENT_ID ?? "",
        vpPresentationId: process.env.VP_PRESENTATION_ID ?? "",
        vpPurpose: process.env.VP_PURPOSE ?? "",
    });
}
