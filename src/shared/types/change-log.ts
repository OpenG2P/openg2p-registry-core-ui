export interface ChangeLog {
    change_log_id: string;
    register_id: string;
    internal_record_id: string;
    operation_id: string;
    source_partner_id: string;
    created_by: string;
    created_at: string;
    approval_status: "PENDING" | "APPROVED" | "REJECTED";
    approved_by: string | null;
    approved_at: string | null;
    change_payload: Record<string, any>;
}

export interface ChangeLogResponse {
    change_logs: ChangeLog[];
}
