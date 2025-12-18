import { NextRequest, NextResponse } from 'next/server';
import {
    createBackendRequest,
    BACKEND_CONFIG,
    BackendResponse,
    RequestBody
} from '@/shared/types';


/**
 * GET /api/stats/outgoing_message
 * Fetches outgoing_message summary data
 * Backend endpoint: POST /register/get_outgoing_message_summary_data
 */
export async function GET(req: NextRequest) {
    try {
        
        const payload:RequestBody = {
            pagination_request: {},
            request_payload:{},
        }
        const backendRequest = createBackendRequest(payload);
        const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_outgoing_message_summary_data`;

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
