import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function GET(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/ingestion-data/get_ingestion_summary_data',
    buildPayload: () => ({
      pagination_request: {
        current_page: 1,
        page_size: 1,
        sort_by: "",
        search_text: ""
      },
      request_payload: {},
    })
  });
}
