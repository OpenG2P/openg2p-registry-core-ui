import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { register_id, internal_record_id } = body || {};

    const change_logs = [
        {
            change_log_id: "ce31285b-38b0-48a8-b737-4ba6540043e6",
            register_id,
            internal_record_id,
            operation_id: "op-001",
            source_partner_id: "registry-ui",
            created_by: "system",
            created_at: "2025-12-15T15:35:36.112Z",
            approval_status: "PENDING",
            approved_by: null,
            approved_at: null,
            change_payload: {
                first_name: "John",
                last_name: "Doe",
            },
        },
        {
            change_log_id: "2a7b3b61-9c6a-4f25-9dd6-1cfd0a94e221",
            register_id,
            internal_record_id,
            operation_id: "op-002",
            source_partner_id: "registry-ui",
            created_by: "admin",
            created_at: "2025-12-14T10:20:11.441Z",
            approval_status: "APPROVED",
            approved_by: "admin",
            approved_at: "2025-12-14T12:00:00.000Z",
            change_payload: {
                phone_number: "+91XXXXXXXXXX",
            },
        },
        {
            change_log_id: "9f0b1c23-aaaa-bbbb-cccc-123456789000",
            register_id,
            internal_record_id,
            operation_id: "op-003",
            source_partner_id: "registry-ui",
            created_by: "reviewer",
            created_at: "2025-12-13T08:10:00.000Z",
            approval_status: "REJECTED",
            approved_by: "reviewer",
            approved_at: "2025-12-13T09:00:00.000Z",
            change_payload: {
                nationality: "Indian",
            },
        },
    ];

    return NextResponse.json({
        change_logs,
    });
}
