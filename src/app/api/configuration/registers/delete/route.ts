import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/register-metadata/delete_register",
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: 1,
                page_size: 1,
                sort_by: "",
                filter_by: undefined,
                search_text: ""
            },
            request_payload: {
                register_id: jsonBody.register_id,
            },

        }),
    });
}
