import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function GET(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: '/intake-form-data/get_intake_form_submissions_summary',
        buildPayload: () => ({
            pagination_request: {
                current_page: 1,
                page_size: 1,
                sort_by: "",
                search_text: ""
            },
            request_payload: {},
        })
    });
}
