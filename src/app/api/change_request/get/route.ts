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
//                 {
//                     error: "change_log_id is required",
//                 },
//                 { status: 400 }
//             );
//         }

//         const backendRequest = createBackendRequest({
//             request_payload: {
//                 change_request_id,
//             },
//         });

//         const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_change_request`;

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

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const changeLogId =
        body?.request_body?.request_payload?.change_request_id;

    if (!changeLogId) {
        return NextResponse.json(
            {
                response_header: {
                    request_id: crypto.randomUUID(),
                    response_status: "FAILURE",
                    response_error_code: "INVALID_REQUEST",
                    response_error_message: "change_log_id is required",
                    response_timestamp: new Date().toISOString(),
                },
            },
            { status: 400 }
        );
    }

    const record = {
        change_request_id: changeLogId,
        register_id: "reg-uuid-001",
        tab_id: "tab-uuid-001",
        internal_record_id: "record-uuid-001",
        section_id: "section-uuid-001",
        source_partner_id: "postman",
        created_by: "system",
        created_at: "2024-01-15T10:30:00Z",
        approval_status: "PENDING",
        approved_by: null,
        approved_at: null,
        no_of_verifications_required: 1,
        no_of_verifications_done: 0,
        change_payload: {
            first_name: "John",
            last_name: "Doe",
            date_of_birth: "1990-05-15",
        },
    };

    return NextResponse.json({
        response_header: {
            request_id: crypto.randomUUID(),
            response_status: "SUCCESS",
            response_error_code: "",
            response_error_message: "",
            response_timestamp: new Date().toISOString(),
        },
        response_body: {
            response_payload: {
                change_request: record,
            },
        },
    });
}
