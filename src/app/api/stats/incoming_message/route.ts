import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  RequestBody,
} from "@/shared/types";

/** Demo response */
const MOCK_INCOMING_MESSAGE_STATS = {
  total_incoming_messages: 7000,
  partners: 5,
  data_models: 3,
  imageUrl:"/openg2p_logo.png" 

};

export async function GET(_req: NextRequest) {
  try {
    /*
    const payload: RequestBody = {
      pagination_request: {},
      request_payload: {},
    };

    const backendRequest = createBackendRequest(payload);
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_incoming_message_summary_data`;

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
    return NextResponse.json(MOCK_INCOMING_MESSAGE_STATS);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
