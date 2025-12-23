import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { change_log_id } = body?.request_body?.request_payload || {};

    return NextResponse.json({
        response_header: {
            request_id: body?.request_header?.request_id ?? '',
            response_status: 'SUCCESS',
        },
        response_body: {
            response_payload: {
                verifications: [
                    {
                        verification_id: 'verification-uuid-001',
                        change_log_id,
                        verified_by: 'verifier1@example.com',
                        verified_at: '2024-01-15T10:32:00Z',
                        verification_observations: 'Documents verified successfully',
                        is_approved: true,
                    },
                    {
                        verification_id: 'verification-uuid-002',
                        change_log_id,
                        verified_by: 'verifier2@example.com',
                        verified_at: '2024-01-15T10:35:00Z',
                        verification_observations: 'Identity confirmed',
                        is_approved: true,
                    },
                ],
            },
        },
    });
}
