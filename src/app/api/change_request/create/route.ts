import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";


export async function POST(
  request: NextRequest,
) {
  try {
    const {
      register_id,
      register_mnemonic,
      internal_record_id,
      section_register_id,
      tab_id,
      section_id,
      section_schema,
      section_data,
      documents,
    } = await request.json();

    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: {
        register_id,
        register_mnemonic,
        section_register_id,
        tab_id,
        section_id,
        change_payload: {
          internal_record_id,
          additionalProp1:{
            section_schema,
            section_data,
          }
         
        },
        documents,
      },
    });


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

  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
