export interface ChangeDocument {
    doc_id: string;
    doc_name: string;
    doc_url?: string;
}

export interface ChangeLog {
    change_log_id: string;
    approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;

    verification: {
        required: number;
        completed: number;
    };

    documents: ChangeDocument[];
}
