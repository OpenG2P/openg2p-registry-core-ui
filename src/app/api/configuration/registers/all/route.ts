import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: '/register-metadata/get_all_registers',
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: jsonBody?.current_page,
                page_size: jsonBody?.page_size,
                sort_by: "",
                filter_by: undefined,
                search_text: ""
            },
            request_payload: {}
        }),
        transformResponse: (responseBody) => ({
            registers: responseBody?.response_payload || [],
            pagination: responseBody?.pagination_response
        }),
    });
}
