import { NextRequest, NextResponse } from 'next/server';
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  RequestBody
} from '@/shared/types';


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
    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/${type}/list`;

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
