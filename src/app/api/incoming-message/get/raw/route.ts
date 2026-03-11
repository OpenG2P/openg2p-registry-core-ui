import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: "/ingestion-data/get_raw_payload",
        buildPayload: (body) => ({
            pagination_request: {
                current_page: 1,
                page_size: 1,
                sort_by: "",
                filter_by: undefined,
                search_text: "",
            },
            request_payload: {
                ingest_id: body.ingest_id,
            },
        }),
        transformResponse: (responseBody) => responseBody.response_payload,
    });
}
