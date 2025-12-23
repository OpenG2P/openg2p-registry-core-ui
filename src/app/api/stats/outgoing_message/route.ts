import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  RequestBody,
} from "@/shared/types";

/** Demo response */
const MOCK_OUTGOING_MESSAGE_STATS = {
  total_outgoing_messages: 1800,
  topics: 7,
  data_models: 8,
};

export async function GET(_req: NextRequest) {
  try {
    /*
    const payload: RequestBody = {
      pagination_request: {},
      request_payload: {},
    };

    const backendRequest = createBackendRequest(payload);
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_outgoing_message_summary_data`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    const backendResponse: BackendResponse = await response.json();
    return NextResponse.json(
      backendResponse.response_body.response_payload
    );
    */

    /** Mock response */
    return NextResponse.json(MOCK_OUTGOING_MESSAGE_STATS);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
