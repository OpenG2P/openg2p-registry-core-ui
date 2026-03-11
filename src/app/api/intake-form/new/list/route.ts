import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-metadata/get_intake_forms_for_register",
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: jsonBody.current_page,
                page_size: jsonBody.page_size,
                sort_by: jsonBody.sort_by,
                filter_by: jsonBody.filter_by,
                search_text: jsonBody.search_text,
            },
            request_payload: {
                register_id: jsonBody.register_id,
            },
        }),
    });
}