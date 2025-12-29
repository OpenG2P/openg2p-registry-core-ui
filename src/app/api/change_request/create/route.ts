import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

/**
 * POST /api/register/[type]/[id]/change_request/create
 * Creates a change request for edited sections/widgets
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const body = await request.json();

    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: body,
    });
    
    /*
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/change_request/create`;

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

    return NextResponse.json(
      backendResponse.response_body.response_payload,
      { status: 200 }
    );
    */

    /** Mock response */
    return NextResponse.json(
      {
        success: true,
        message: "Change request created successfully",
        change_request_id: `CR-${Date.now()}`,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
