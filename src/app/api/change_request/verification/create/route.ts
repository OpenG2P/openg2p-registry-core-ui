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

//         const {
//             change_request_id,
//             verification_observations,
//             is_approved,
//         } = requestPayload;

//         if (!change_request_id) {
//             return NextResponse.json(
//                 { error: "change_request_id is required" },
//                 { status: 400 }
//             );
//         }

//         if (typeof is_approved !== "boolean") {
//             return NextResponse.json(
//                 { error: "is_approved must be boolean" },
//                 { status: 400 }
//             );
//         }

//         const backendRequest = createBackendRequest({
//             request_payload: {
//                 change_request_id,
//                 verification_observations,
//                 is_approved,
//             },
//         });

//         const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/add_verification_for_change_request`;

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