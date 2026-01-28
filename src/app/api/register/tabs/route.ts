import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/register-metadata/get_register_tabs',
    buildPayload: (body) => ({
      pagination_request: {
        current_page: 1,
        page_size: 1,
        sort_by: "",
        filter_by: undefined,
        search_text: "",
      },
      request_payload: {
        register_id: body.register_id
      }
    }),

    caching: {
      next: { revalidate: 3600 }
    } as RequestInit,

    responseHeaders: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
