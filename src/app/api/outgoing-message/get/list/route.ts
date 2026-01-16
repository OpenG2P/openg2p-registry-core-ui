import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const paginationRequest = body?.request_body?.pagination_request ?? {};

    const currentPage = paginationRequest.current_page ?? 1;
    const pageSize = paginationRequest.page_size ?? 10;

    // Mock outgoing messages data
    const rawOutgoingMessages = [
        {
            outgest_id: "1234567890",
            queued_datetime: "2025-10-25 10:32AM",
            source_register: "Birth Registry",
            record_id: "43210",
            source_change_log_id: "12378",

            topic_resolution: "Resolved",
            topic_resolution_datetime: "2025-10-25 10:32AM",
            number_of_topics_resolved: 7,
            topic_names: [
                "Vaccination",
                "Immunization",
                "Birth Registration",
                "Death Registration",
                "Migration",
                "Change of Address",
                "Name Correction",
            ],
        },
        {
            outgest_id: "0987654321",
            queued_datetime: "2025-11-01 09:15AM",
            source_register: "Health Registry",
            record_id: "98765",
            source_change_log_id: "67890",

            topic_resolution: "Pending",
            topic_resolution_datetime: "2025-11-01 09:20AM",
            number_of_topics_resolved: 3,
            topic_names: [
                "Health Checkup",
                "Disease Reporting",
                "Vaccination",
            ],
        },
        // Add more mock messages as needed
    ];

    const totalItems = rawOutgoingMessages.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedMessages = rawOutgoingMessages.slice(startIndex, endIndex);

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
                outgoing_messages: paginatedMessages,
            },
        },
    });
}
