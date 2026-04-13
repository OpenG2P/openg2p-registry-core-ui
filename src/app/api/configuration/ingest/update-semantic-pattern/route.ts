import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/ingestion-config/update_semantic_pattern",
        buildPayload: (body) => ({
            pagination_request: {
                current_page: body.current_page ?? 1,
                page_size: body.page_size ?? 20,
                sort_by: body.sort_by ?? "",
                filter_by: body.filter_by ?? "",
                search_text: body.search_text ?? ""
            },
            request_payload: {
                pattern_for_register: body.pattern_for_register,
                pattern_for_section: body.pattern_for_section,
                key_path_for_business_payload: body.key_path_for_business_payload,
                raw_payload_enricher_class: body.raw_payload_enricher_class,
            }
        }),
    });
}

/*
"response_payload": {
  "semantic_pattern_id": "string",
  "data_model_id": "string",
  "register_id": "string",
  "section_id": "string",
  "pattern_for_register": "string",
  "pattern_for_section": "string",
  "key_path_for_business_payload": "string",
  "raw_payload_enricher_class": "string"
}
*/
