import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-data/search_in_intake_form_submissions",
        buildPayload: (body) => ({
            pagination_request: {
                current_page: body.current_page ?? 1,
                page_size: body.page_size ?? 10,
                sort_by: body.sort_by ?? "",
                filter_by: body.filter_by ?? "",
                search_text: body.search_text ?? "",
            },
            request_payload: {
                register_id: body.register_id,
                search_text: body.search_text,
                current_page: body.current_page,
                page_size: body.page_size,
                sort_by: body.sort_by,
                filter_by: body.filter_by,
            },
        }),
        transformResponse: (responseBody) => ({
            submissions: responseBody?.response_payload || [],
            pagination: responseBody?.pagination_response,
        }),
    });
}