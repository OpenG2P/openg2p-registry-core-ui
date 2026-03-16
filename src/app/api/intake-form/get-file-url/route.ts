import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/documents/get_file_url",
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: 1,
                page_size: 5,
                sort_by: jsonBody.sort_by ?? "",
                filter_by: jsonBody.filter_by ?? "",
                search_text: jsonBody.search_text ?? "",
            },
            request_payload: {
                document_store_id: jsonBody.document_store_id,
            },
        }),
    });
}