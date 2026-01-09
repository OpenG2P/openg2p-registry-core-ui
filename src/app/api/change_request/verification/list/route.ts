// import { NextRequest, NextResponse } from "next/server";
// import {
//     createBackendRequest,
//     BACKEND_CONFIG,
//     BackendResponse,
// } from "@/shared/types";

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();

//         const requestPayload =
//             body?.request_body?.request_payload ?? {};

//         const { change_request_id } = requestPayload;

//         if (!change_request_id) {
//             return NextResponse.json(
//                 { error: "change_request_id is required" },
//                 { status: 400 }
//             );
//         }

//         const backendRequest = createBackendRequest({
//             request_payload: {
//                 change_request_id,
//             },
//         });

//         const backendUrl =
//             `${BACKEND_CONFIG.apiUrl}/register/get_verifications_for_change_request`;

//         const response = await fetch(backendUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(backendRequest),
//         });

//         if (!response.ok) {
//             return NextResponse.json(
//                 { error: `Backend HTTP error ${response.status}` },
//                 { status: response.status }
//             );
//         }

//         const backendResponse: BackendResponse = await response.json();

//         if (backendResponse.response_header.response_status === "ERROR") {
//             return NextResponse.json(
//                 { error: backendResponse.response_header.response_error_message },
//                 { status: 400 }
//             );
//         }

//         return NextResponse.json(backendResponse);

//     } catch (e) {
//         return NextResponse.json(
//             { error: e instanceof Error ? e.message : "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }


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
