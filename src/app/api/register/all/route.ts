import { NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

const MOCK_REGISTERS = [
  {
    register_id: "25d460ac-50cf-4386-b486-23a4e9b7e254",
    register_mnemonic: "Farmer",
    register_subject: "Farmers",
    register_description: "Farmer Register",
    master_register_id: null,
  },
  {
    register_id: "3a8c0f86-b782-4f0a-becb-beede846a340",
    register_mnemonic: "Family",
    register_subject: "Families",
    register_description: "Family Register",
    master_register_id: null,
  },
  {
    register_id: "b3284590-2865-4a81-b4da-85588070a4a4",
    register_mnemonic: "FamilyMember",
    register_subject: "FamilyMembers",
    register_description: "Family Member Register",
    master_register_id: null,
  },
];

export async function GET() {
  try {
    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: {},
    });

    /*
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_all_registers`;

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

    const registers = backendResponse.response_body.response_payload;

    return NextResponse.json(registers);
    */

    return NextResponse.json(MOCK_REGISTERS);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
