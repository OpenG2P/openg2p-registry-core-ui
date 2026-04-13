import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/_lib/requireAuth";
import { getBackendConfig } from "@/app/api/_lib/backend-config";

export async function POST(request: NextRequest) {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    try {
        const formData = await request.formData();
        const backendConfig = getBackendConfig();
        const backendUrl = `${backendConfig.backendApiUrl}/templates/upload_template`;

        const outgoingForm = new FormData();
        for (const [key, value] of formData.entries()) {
            outgoingForm.append(key, value);
        }

        const { 'content-type': _, 'Content-Type': __, ...cleanHeaders } = auth.backendHeaders as Record<string, string>;

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: cleanHeaders,
            body: outgoingForm,
        });

        const backendResponse = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: backendResponse.errors?.[0]?.message || "Upload failed" },
                { status: response.status }
            );
        }

        if (backendResponse.response_header?.response_status === "ERROR") {
            return NextResponse.json(
                {
                    error: backendResponse.response_header.response_error_message || "Upload failed",
                    code: backendResponse.response_header.response_error_code,
                },
                { status: 400 }
            );
        }

        const uploadedDocuments = backendResponse.response_body?.response_payload?.uploaded_documents || [];

        const result = uploadedDocuments.map(({ document_store_id, document_label }: any) => ({
            document_store_id,
            document_label,
        }));

        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}