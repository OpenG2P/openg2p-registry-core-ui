import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/register/search_in_change_request",
        buildPayload: (jsonBody) => {
            const paginationRequest =
                jsonBody?.request_body?.pagination_request ?? {};

            return {
                pagination_request: {
                    current_page: paginationRequest.current_page ?? 1,
                    page_size: paginationRequest.page_size ?? 10,
                    sort_by: paginationRequest.sort_by ?? "",
                    filter_by: paginationRequest.filter_by ?? "",
                    search_text: paginationRequest.search_text ?? "",
                },
                request_payload: {},
            };
        },
        transformResponse: (responseBody) => ({
            records: responseBody.response_payload,
            pagination: responseBody.pagination_response,
        }),
    });
}
