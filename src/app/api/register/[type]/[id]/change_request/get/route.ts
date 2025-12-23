import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const changeLogId =
        body?.request_body?.request_payload?.change_log_id;

    if (!changeLogId) {
        return NextResponse.json(
            {
                response_header: {
                    request_id: "",
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
        change_log_id: changeLogId,
        register_id: "reg-uuid-001",
        tab_id: "tab-uuid-001",
        internal_record_id: "record-uuid-001",
        section_id: "section-uuid-001",
        source_partner_id: "postman",
        created_by: "system",
        created_at: "2024-01-15T10:30:00Z",
        no_of_verifications_required: 1,
        no_of_verifications_done: 0,
        approval_status: "PENDING",
        approved_by: null,
        approved_at: null,
        change_payload: {
            first_name: "John",
            last_name: "Doe",
            date_of_birth: "1990-05-15",
        },
    };

    return NextResponse.json({
        response_header: {
            request_id: "abc-123",
            response_status: "SUCCESS",
            response_error_code: "",
            response_error_message: "",
            response_timestamp: new Date().toISOString(),
        },
        response_body: {
            pagination_response: null,
            response_payload: record,
        },
    });
}
