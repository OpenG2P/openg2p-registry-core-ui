import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/change-requests/get_change_request",

        buildPayload: (body) => ({
            pagination_request: {
                current_page: 1,
                page_size: 1,
                sort_by: "",
                filter_by: undefined,
                search_text: "",
            },
            request_payload: {
                change_request_id: body.change_request_id,
            },
        }),

        transformResponse: (responseBody) => responseBody.response_payload,
    });
}
