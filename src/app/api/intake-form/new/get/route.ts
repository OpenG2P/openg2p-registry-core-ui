import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-metadata/get_intake_form",
        buildPayload: (jsonBody) => ({
            pagination_request: undefined,
            request_payload: {
                register_id: jsonBody.register_id,
                intake_form_id: jsonBody.intake_form_id,
            },
        }),
    });
}