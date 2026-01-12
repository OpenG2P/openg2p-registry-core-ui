import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

export async function POST(
  req: NextRequest,
) {
  try {
    const {
      current_page,
      page_size,
      sort_by,
      filter_by,
      search_text,
      register_id,
    } = await req.json();

    const backendRequest = createBackendRequest({
      pagination_request: {
        current_page,
        page_size,
        sort_by,
        filter_by,
        search_text,
      },
      request_payload: {
        register_id,
      },
    });

    
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/search_in_a_register`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    const backendResponse: BackendResponse = await response.json();

    if (backendResponse.response_header.response_status === "ERROR") {
      return NextResponse.json(
        { error: backendResponse.response_header.response_error_message },
        { status: 400 }
      );
    }

    const { response_payload, pagination_response } =
      backendResponse.response_body;

    return NextResponse.json({
      records: response_payload,
      pagination: pagination_response,
    });
  
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
