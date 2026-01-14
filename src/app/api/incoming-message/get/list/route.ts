import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const paginationRequest = body?.request_body?.pagination_request ?? {};

    const currentPage = paginationRequest.current_page ?? 1;
    const pageSize = paginationRequest.page_size ?? 10;

    const rawIncomingMessages = [
        {
            ingest_id: "1234567890",
            partner: "Birth Registry",
            data_model: "Model Name",
            ingest_datetime: "2025-10-25 10:32AM",
            classification_status: "Processed",
            classification_datetime: null,

            target_register: "-- -- --",
            operation: "Value 2",
            transformation_status: "Processed",
            transformation_datetime: "2025-10-25 10:32AM",

            transformation_template: "F9282420",
            ingestion_status: "Processed",
            ingestion_datetime: "2025-10-25 10:32AM",

            change_log_id: "12345",
        },
        {
            ingest_id: "0987654321",
            partner: "Health Registry",
            data_model: "Another Model",
            ingest_datetime: "2025-11-01 09:15AM",
            classification_status: "Pending",
            classification_datetime: "2025-11-01 09:20AM",

            target_register: "Health Reg 1",
            operation: "Update",
            transformation_status: "Pending",
            transformation_datetime: null,

            transformation_template: "A2345678",
            ingestion_status: "Pending",
            ingestion_datetime: null,

            change_log_id: "67890",
        },
    ];

    const totalItems = rawIncomingMessages.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedMessages = rawIncomingMessages.slice(startIndex, endIndex);

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
                incoming_messages: paginatedMessages,
            },
        },
    });
}
