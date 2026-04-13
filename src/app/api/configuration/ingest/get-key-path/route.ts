import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/ingestion-config/get_incoming_key_path",
        buildPayload: (body) => ({
            pagination_request: {
                current_page: body.current_page ?? 1,
                page_size: body.page_size ?? 20,
                sort_by: body.sort_by ?? "",
                filter_by: body.filter_by ?? "",
                search_text: body.search_text ?? ""
            },
            request_payload: {
                key_path_id: body.key_path_id,
            }
        }),
    });
}

/*
"response_payload": {
  "key_path_id": "string",
  "data_model_id": "string",
  "key_path_for_message_id": "string",
  "key_path_for_sender": "string",
  "key_path_for_signature": "string",
  "key_path_for_signature_payload": "string",
  "is_list": true,
  "key_path_for_list_elements": "string"
}
*/