import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function POST(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/register/get_register_schema',
    buildPayload: (body) => ({
      pagination_request: undefined,
      request_payload: {
        register_id: body.register_id,
      },
    }),
    transformResponse: (responseBody) => responseBody.response_payload.filter_schema
  });
}
