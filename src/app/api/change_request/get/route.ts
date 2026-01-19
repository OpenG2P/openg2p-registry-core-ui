import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/register/get_change_request",

        buildPayload: (jsonBody) => {
            const payload =
                jsonBody?.request_body?.request_payload ?? {};

            return {
                pagination_request: {
                    current_page: 1,
                    page_size: 1,
                    sort_by: "",
                    filter_by: undefined,
                    search_text: "",
                },
                request_payload: {
                    change_request_id: payload.change_request_id,
                },
            };
        },

        transformResponse: (responseBody) => ({
            response_payload: responseBody.response_payload,
        }),
    });
}
