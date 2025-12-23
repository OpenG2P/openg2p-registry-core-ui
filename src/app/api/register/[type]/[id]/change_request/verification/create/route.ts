import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    const body = await req.json();
    const payload = body?.request_body?.request_payload;

    return NextResponse.json({
        response_header: {
            request_id: body?.request_header?.request_id ?? '',
            response_status: 'SUCCESS',
        },
        response_body: {
            response_payload: {
                verification_id: randomUUID(),
                change_log_id: payload.change_log_id,
                verified_by: 'verifier@example.com',
                verified_at: new Date().toISOString(),
                verification_observations: payload.verification_observations,
                is_approved: payload.is_approved,
            },
        },
    });
}
