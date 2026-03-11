import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function GET(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-data/get_intake_form_submissions_summary",
        buildPayload: () => ({
            pagination_request: undefined,
            request_payload: {},
        }),
    });
}