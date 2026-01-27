import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function GET(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/register-data/get_register_summary_data',
    buildPayload: () => ({
      pagination_request: {
        current_page: 1,
        page_size: 1
      },
      request_payload: {
      },
    })
  });
}
