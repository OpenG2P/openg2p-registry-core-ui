import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const paginationRequest =
        body?.request_body?.pagination_request ?? {};

    const currentPage = paginationRequest.current_page ?? 1;
    const pageSize = paginationRequest.page_size ?? 10;

    const rawChangeLogs = [
        {
            change_request_id: "ce31285b-38b0-48a8",
            register_id: "123",
            tab_id: "tab-001",
            internal_record_id: "12234425",
            section_id: "section-001",
            source_partner_id: "registry-ui",
            created_by: "system",
            created_at: "2025-12-15T15:35:36.112Z",
            approval_status: "PENDING",
            approved_by: null,
            approved_at: null,
            no_of_verifications_required: 3,
            no_of_verifications_done: 1,
            change_payload: {
                first_name: "John",
                last_name: "Doe",
            },
        },
        {
            change_request_id: "ce31285b-38b0-48a9",
            register_id: "123",
            tab_id: "tab-001",
            internal_record_id: "12234425",
            section_id: "section-001",
            source_partner_id: "registry-ui",
            created_by: "admin",
            created_at: "2025-12-14T10:20:11.441Z",
            approval_status: "APPROVED",
            approved_by: "admin",
            approved_at: "2025-12-14T12:00:00.000Z",
            no_of_verifications_required: 3,
            no_of_verifications_done: 3,
            change_payload: {
                phone_number: "+91XXXXXXXXXX",
            },
        },
        {
            change_request_id: "ce31285b-38b0-48a7",
            register_id: "123",
            tab_id: "tab-001",
            internal_record_id: "12234425",
            section_id: "section-001",
            source_partner_id: "registry-ui",
            created_by: "reviewer",
            created_at: "2025-12-13T08:10:00.000Z",
            approval_status: "REJECTED",
            approved_by: "reviewer",
            approved_at: "2025-12-13T09:00:00.000Z",
            no_of_verifications_required: 3,
            no_of_verifications_done: 1,
            change_payload: {
                nationality: "Indian",
            },
        },
    ];

    const totalItems = rawChangeLogs.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedLogs = rawChangeLogs.slice(startIndex, endIndex);

    return NextResponse.json({
        response_header: {
            request_id: crypto.randomUUID(),
            response_status: "SUCCESS",
            response_error_code: "",
            response_error_message: "",
            response_timestamp: new Date().toISOString(),
        },
        response_body: {
            pagination_response: {
                number_of_items: totalItems,
                number_of_pages: totalPages,
            },
            response_payload: {
                change_requests: paginatedLogs,
            },
        },
    });
}
