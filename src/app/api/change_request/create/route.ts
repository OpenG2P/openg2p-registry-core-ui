import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
  return proxyToBackend({
    req: request,
    targetEndpoint: "/change-requests/create_change_request",
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
        register_mnemonic: jsonBody.register_mnemonic,
        section_register_id: jsonBody.section_register_id,
        tab_id: jsonBody.tab_id,
        section_id: jsonBody.section_id,
        internal_record_id:jsonBody.internal_record_id,
        change_payload: jsonBody.section_records,
        documents: jsonBody.documents,
      },
    }),
  });
}
// UPDATE
// ADD
// DELETE
// edit_action:
