import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  RequestBody,
} from "@/shared/types";

/** Demo register summary data */
const MOCK_REGISTER_SUMMARY = [
  {
    register_id: "25d460ac-50cf-4386-b486-23a4e9b7e254",
    register_mnemonic: "Farmer",
    register_subject: "Farmers",
    total_record_count: 7,
    imageUrl:"/openg2p_logo.png" 

  },

  {
    register_id: "3a8c0f86-b782-4f0a-becb-beede846a340",
    register_mnemonic: "Family",
    register_subject: "Families",
    total_record_count: 3,
    imageUrl:"/openg2p_logo.png" 
  },
  {
    register_id: "b3284590-2865-4a81-b4da-85588070a4a4",
    register_mnemonic: "FamilyMember",
    register_subject: "FamilyMembers",
    total_record_count: 6,
    imageUrl:"/openg2p_logo.png",
  }
];

/**
 * GET /api/stats/register
 * Fetches register summary data with record counts
 * Backend endpoint: POST /register/get_register_summary_data
 */
export async function GET(_req: NextRequest) {
  try {
    /*
    const payload: RequestBody = {
      pagination_request: {},
      request_payload: {},
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
    */

    /** Mock response */
    return NextResponse.json(MOCK_REGISTER_SUMMARY);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
