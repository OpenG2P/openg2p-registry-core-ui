import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-data/finalize_submission",
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: jsonBody.current_page,
                page_size: jsonBody.page_size,
                sort_by: jsonBody.sort_by,
                filter_by: jsonBody.filter_by,
                search_text: jsonBody.search_text,
            },
            request_payload: {
                submission_id: jsonBody.submission_id,
            },
        }),
    });
}