import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

const MOCK_OUTGOING_MESSAGE_STATS = {
  total_outgoing_messages: 1800,
  topics: 7,
  data_models: 8,
};

export async function GET(req: NextRequest) {
  /*
  return proxyToBackend({
    req,
    targetEndpoint: '/register/get_outgoing_message_summary_data',
    buildPayload: () => ({
      pagination_request: {
        current_page: 1,
        page_size: 1,
      },
      request_payload: {},
    })
  });
  */
  try {
    return NextResponse.json(MOCK_OUTGOING_MESSAGE_STATS);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
