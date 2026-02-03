import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: '/register-metadata/get_register_tabs',
        buildPayload: (body) => ({
            pagination_request: {
                current_page: body.page || 1,
                page_size: body.pageSize || 10,
                sort_by: "",
                filter_by: undefined,
                search_text: "",
            },
            request_payload: {
                register_id: body.register_id
            }
        }),
        transformResponse: (responseBody) => ({
            tabs: responseBody?.response_payload || [],
            pagination: responseBody?.pagination_response
        }),


    });
}

