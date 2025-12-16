import { NextRequest, NextResponse } from 'next/server';
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse
} from '@/shared/types';


/**
 * GET /api/register/[type]
 * Fetches list of records for a specific register type
 * Backend endpoint: POST /register/[type]/list
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const current_page = parseInt(searchParams.get('page') || '1');
    const page_size = parseInt(searchParams.get('limit') || '7');

    const requestPayload: any = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'page' && key !== 'limit') {
        requestPayload[key] = value;
      }
    }

    const paginationRequest = { current_page, page_size };
    const backendRequest = createBackendRequest(paginationRequest, { request_payload: requestPayload });
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/${type}/list`;

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

    const responsePayload: any = backendResponse.response_body.response_payload;
    const items = Array.isArray(responsePayload) ? responsePayload : [];

    const data = {
      items: items,
      pagination: backendResponse.response_body.pagination_response
    };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
