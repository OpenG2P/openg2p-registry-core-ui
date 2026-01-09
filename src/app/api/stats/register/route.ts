import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  RequestBody,
} from "@/shared/types";

export async function GET(_req: NextRequest) {
  try {
    
    const payload: RequestBody = {
      pagination_request: {
        current_page: 1,
        page_size: 1
      },
      request_payload: {
      },
    };

    const backendRequest = createBackendRequest(payload);
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_register_summary_data`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    const backendResponse: BackendResponse = await response.json();

    return NextResponse.json(
      backendResponse.response_body.response_payload
    );

  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
