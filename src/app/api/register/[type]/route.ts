import { NextRequest, NextResponse } from 'next/server';
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  RequestBody
} from '@/shared/types';

const MOCK_REGISTER_RECORDS = {
  pagination_response: {
    number_of_items: 3,
    number_of_pages: 1,
  },
  response_payload: [
    {
      internal_record_id: 'affa29a7-61db-4321-a256-e0ecb216419c',
      functional_record_id: 'FARMER-00001',
      link_record_id: null,
      record_name: 'Rajesh Kumar',
      image: null,
      created_by: 'system',
      created_at: '2025-12-15T15:35:36.541096',
      last_approved_at: '2025-12-15T15:35:36.541098',
      last_approved_by: 'system',
      display_fields: [
        { field_name: 'first_name', value: 'Rajesh', order: 1 },
        { field_name: 'last_name', value: 'Kumar', order: 2 },
        { field_name: 'date_of_birth', value: '1975-05-15', order: 3 },
        { field_name: 'gender', value: 'Male', order: 4 },
        { field_name: 'mobile_number', value: '9876543210', order: 5 },
        { field_name: 'village', value: 'Rampur', order: 6 },
      ],
    },
    {
      internal_record_id: 'bfa41c3d-2b5f-4c7b-9c5d-12c8c8a0b1aa',
      functional_record_id: 'FARMER-00002',
      link_record_id: null,
      record_name: 'Sita Devi',
      image: null,
      created_by: 'system',
      created_at: '2025-12-16T10:12:21.112345',
      last_approved_at: '2025-12-16T10:12:21.112349',
      last_approved_by: 'system',
      display_fields: [
        { field_name: 'first_name', value: 'Sita', order: 1 },
        { field_name: 'last_name', value: 'Devi', order: 2 },
        { field_name: 'date_of_birth', value: '1982-09-08', order: 3 },
        { field_name: 'gender', value: 'Female', order: 4 },
        { field_name: 'mobile_number', value: '9123456789', order: 5 },
        { field_name: 'village', value: 'Lakshmipur', order: 6 },
      ],
    },
    {
      internal_record_id: 'c8d6f91a-8e64-4a1e-9f8b-77c9b8a2d9fe',
      functional_record_id: 'FARMER-00003',
      link_record_id: null,
      record_name: 'Amit Sharma',
      image: null,
      created_by: 'system',
      created_at: '2025-12-17T08:45:10.998765',
      last_approved_at: '2025-12-17T08:45:10.998770',
      last_approved_by: 'system',
      display_fields: [
        { field_name: 'first_name', value: 'Amit', order: 1 },
        { field_name: 'last_name', value: 'Sharma', order: 2 },
        { field_name: 'date_of_birth', value: '1990-01-22', order: 3 },
        { field_name: 'gender', value: 'Male', order: 4 },
        { field_name: 'mobile_number', value: '9988776655', order: 5 },
        { field_name: 'village', value: 'Shivpura', order: 6 },
      ],
    },
  ],
};


/**
 * GET /api/register/[type]
 * Fetches list of records for a specific register type
 * Backend endpoint: POST /register/[type]/list
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    
    const payload:RequestBody = await req.json();
    const backendRequest = createBackendRequest(payload);
    // const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/search_in_a_register`;

    // const response = await fetch(backendUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(backendRequest),
    // });

    // const backendResponse: BackendResponse = await response.json();
    // return NextResponse.json(backendResponse.response_body);
    return NextResponse.json(MOCK_REGISTER_RECORDS)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
