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
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const payload = {
      register_type: type,
      register_id: id,
    };
    const backendRequest = createBackendRequest({}, { request_payload: payload });
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/${type}/details`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.error || 'Backend request failed' }, { status: response.status });
    }

    const backendResponse: BackendResponse = await response.json();

    if (
      backendResponse.response_header.response_status !== 'SUCCESS' &&
      backendResponse.response_header.response_error_message
    ) {
      throw new Error(
        backendResponse.response_header.response_error_message ||
        'Backend request failed'
      );
    }

    const data = backendResponse.response_body.response_payload;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
