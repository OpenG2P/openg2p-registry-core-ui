import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

const MOCK_RECORD_DATA = {
  internal_record_id: "18b442ea-2d5d-4186-bd6a-7111822ac2e9",
  functional_record_id: "18b442ea-2d5d-4186-bd6a-7111822ac2e9",
  link_record_id: null,

  created_by: "system",
  created_at: "2025-12-15T15:35:36.541096",
  last_approved_at: "2025-12-15T15:35:36.541098",
  last_approved_by: "system",

  additional_fields: {
    farmer: {
    first_name: "Ramesh",
    last_name: "Kumar",
    gender: "Male",
    age: 42,

    phone: "9876543210",
    email: "ramesh.kumar@example.com",
    village: "Rampur",
    district: "Patna",

    category: "Small Farmer",
    education: "High School",
    occupation: "Agriculture",
    marital_status: "Married"
  },

  crops: {
    name: "Wheat",
    season: "Rabi",
    type: "Cereal",
    variety: "HD-2967",

    area: 2.5,
    irrigation: "Canal",
    yield: 18,
    sowing_method: "Line Sowing"
  }
  }
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { id } = await params;
    const { register_id, internal_record_id } = await req.json();

    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: {
        register_id,
        internal_record_id,
      },
    });

    /*
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_record`;

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

    const record =
      backendResponse.response_body.response_payload;

    return NextResponse.json(record);
    */

    return NextResponse.json(MOCK_RECORD_DATA);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
