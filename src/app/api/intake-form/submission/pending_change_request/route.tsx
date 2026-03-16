import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-data/get_number_of_pending_change_requests_for_submission",
        buildPayload: (jsonBody) => ({
            pagination_request: undefined,
            request_payload: {
                submission_id: jsonBody.submission_id,
            },
        }),
    });
}
