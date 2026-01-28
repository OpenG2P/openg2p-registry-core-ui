import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function GET(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/change-requests/get_register_change_request_summary_data',
    buildPayload: () => ({
      pagination_request: {
        current_page: 1,
        page_size: 1,
      },
      request_payload: {},
    })
  });
}
