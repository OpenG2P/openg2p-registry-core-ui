import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

const MOCK_REGISTER_RECORDS = {
  records: [
    {
      internal_record_id: "affa29a7-61db",
      functional_record_id: "FARMER-00001",
      link_record_id: null,
      record_name: "Rajesh Kumar",
      image: "/male_image.png",
      display_fields: [
        { field_name: "first_name", value: "Rajesh", order: 1 },
        { field_name: "last_name", value: "Kumar", order: 2 },
        { field_name: "date_of_birth", value: "1975-05-15", order: 3 },
        { field_name: "gender", value: "Male", order: 4 },
        { field_name: "mobile_number", value: "9876543210", order: 5 },
        { field_name: "village", value: "Rampur", order: 6 },
      ],
    },
    {
      internal_record_id: "bfa41c3d-2b5f",
      functional_record_id: "FARMER-00002",
      link_record_id: null,
      record_name: "Sita Devi",
      image: '/female_image.png',
      display_fields: [
        { field_name: "first_name", value: "Sita", order: 1 },
        { field_name: "last_name", value: "Devi", order: 2 },
        { field_name: "date_of_birth", value: "1982-09-08", order: 3 },
        { field_name: "gender", value: "Female", order: 4 },
        { field_name: "mobile_number", value: "9123456789", order: 5 },
        { field_name: "village", value: "Lakshmipur", order: 6 },
      ],
    },
    {
      internal_record_id: "c8d6f91a",
      functional_record_id: "FARMER-00003",
      link_record_id: null,
      record_name: "Amit Sharma",
      image: "/male_image.png",
      display_fields: [
        { field_name: "first_name", value: "Amit", order: 1 },
        { field_name: "last_name", value: "Sharma", order: 2 },
        { field_name: "date_of_birth", value: "1990-01-22", order: 3 },
        { field_name: "gender", value: "Male", order: 4 },
        { field_name: "mobile_number", value: "9988776655", order: 5 },
        { field_name: "village", value: "Shivpura", order: 6 },
      ],
    },
  ],
  pagination: {
    number_of_items: 3,
    number_of_pages: 1,
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const {
      current_page,
      page_size,
      search_text,
      register_id,
    } = await req.json();

    const backendRequest = createBackendRequest({
      pagination_request: {
        current_page,
        page_size,
        search_text,
      },
      request_payload: {
        register_id,
      },
    });

    /*
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
    */

    return NextResponse.json(MOCK_REGISTER_RECORDS);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
