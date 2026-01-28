import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/register-data/get_tab_records',
    buildPayload: (body) => ({
      pagination_request: {
        current_page: 1,
        page_size: 1,
        sort_by: "",
        filter_by: undefined,
        search_text: ""
      },
      request_payload: {
        subject_register_id: body.register_id,
        subject_record_id: body.internal_record_id,
        tab_id: body.tab_id
      },
    })
  });
}
