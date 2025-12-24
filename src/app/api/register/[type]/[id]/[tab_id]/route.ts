import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

const MOCK_TAB_RECORD_DATA = [
  {
    section_register_id: "farmer-register-001",
    records:[
      {
      first_name: "Rajesh",
      last_name: "Kumar",
      national_id: "ABCD-1234-5678",
      gender: "male"
      },

    ],
    
  },
  {
    section_register_id: "farmer-crop-register-001",
    records: [
      {
        crop_name: "Rice",
        season: "Kharif",
        area: 4.5,
        expected_yield: 180
      },
      {
        crop_name: "Wheat",
        season: "Rabi",
        area: 4.75,
        expected_yield: 200
      }
    ]
  },
  {
    section_register_id: "farmer-farm-register-001",
    records: [
      {
      total_land_area: 10,
      cultivable_land: 9,
      land_ownership: "owned",
      soil_type: "loam",
      irrigation_source: "borewell",
      land_documents: null,
      equipment: [
        { equipment_name: "Tractor - Mahindra 575" },
        { equipment_name: "Harvester - John Deere" },
        { equipment_name: "Sprayer - Honda" },
        { equipment_name: "Thresher" }
      ]
    }
    ]
  }
];




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

    return NextResponse.json(MOCK_TAB_RECORD_DATA);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
