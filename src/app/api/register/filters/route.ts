import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";
import { FilterConfig } from "@/features/filter/types/types";


export async function POST(req: NextRequest) {
  try {
    const { register_id } = await req.json();

    const backendRequest = createBackendRequest({
      request_payload: {
        register_id,
      },
    });


    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_register_schema`;

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

    const { filter_schema } =
      backendResponse.response_body.response_payload as any;

    return NextResponse.json(filter_schema);


  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
