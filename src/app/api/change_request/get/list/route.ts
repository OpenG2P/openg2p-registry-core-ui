import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: "/register/get_change_requests",

        buildPayload: (jsonBody) => {
            const pagination =
                jsonBody?.request_body?.pagination_request ?? {};

            const payload =
                jsonBody?.request_body?.request_payload ?? {};

            return {
                pagination_request: {
                    current_page: pagination.current_page ?? 1,
                    page_size: pagination.page_size ?? 10,
                    sort_by: pagination.sort_by ?? "",
                    filter_by: pagination.filter_by ?? "",
                    search_text: pagination.search_text ?? "",
                },
                request_payload: {
                    subject_register_id: payload.subject_register_id,
                    subject_record_id: payload.subject_record_id,
                    tab_id: payload.tab_id,
                },
            };
        },

        transformResponse: (responseBody) => ({
            response_body: {
                response_payload: {
                    change_requests: responseBody.response_payload ?? [],
                },
                pagination_response: responseBody.pagination_response,
            },
        }),
    });
}
