import { NextRequest, NextResponse } from 'next/server';
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse
} from '@/shared/types';

const MOCK_RECORD_DATA = {
    pagination_response: null,
    response_payload: {
      internal_record_id: "18b442ea-2d5d-4186-bd6a-7111822ac2e9",
      functional_record_id: "18b442ea-2d5d-4186-bd6a-7111822ac2e9",
      link_record_id: null,
      created_by: "system",
      created_at: "2025-12-15T15:35:36.541096",
      last_approved_at: "2025-12-15T15:35:36.541098",
      last_approved_by: "system",
      additional_fields: {
        person: {
          name: "John",
          id: "1234567890",
          isMarried: false,
          phone: "12345 67890",
          email: "abcd@gmail.com",
        },
        address: {
          village: "Village Name",
          zone: "South Zone",
          area: "Area Name",
        },
        other: {
          details1: "Details 01",
          details2: "Details 02",
          details3: "Details 03",
          details4: "Details 04",
          details5: "Details 05",
          details6: "Details 06",
          details7: "Details 07",
          details8: "Details 08",
          details9: "Details 09",
        },
      },
    },
};


/**
 * GET /api/register/[type]/[id]
 * Fetches details for a specific record
 * Backend endpoint: POST /register/[type]/[id]
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type } = await params;

    const body = await req.json();
    // const backendRequest = createBackendRequest({ pagination_request: {}, request_payload: { request_payload: body } });
    // const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_record`;

    // const response = await fetch(backendUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(backendRequest),
    // });

    // const backendResponse: BackendResponse = await response.json();
    // const data = backendResponse.response_body.response_payload;
    return NextResponse.json(MOCK_RECORD_DATA);

  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
