import { NextRequest, NextResponse } from 'next/server';
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse
} from '@/shared/types';


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
    const backendRequest = createBackendRequest({ pagination_request: {}, request_payload: { request_payload: body } });
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/${type}/details`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendRequest),
    });

    const backendResponse: BackendResponse = await response.json();
    const data = backendResponse.response_body.response_payload;
    return NextResponse.json(data);

  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
