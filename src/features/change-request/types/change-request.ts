export interface ChangeDocument {
    doc_id: string;
    doc_name: string;
    doc_url?: string;
}

export interface ChangeRequest {
    change_request_id: string;
    register_id: string;
    tab_id: string;
    internal_record_id: string;
    section_id: string;
    section_mnemonic?: string;
    section_register_id: string;

    source_partner_id: string;
    created_by: string;
    created_at: string;

    approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approved_by: string | null;
    approved_at: string | null;

    no_of_verifications_required: number;
    no_of_verifications_done: number;
    is_list: boolean;
    change_payload: any;
    current_register_data: any;
}

export type PopupType = "approve" | "reject" | "reject-input";

export interface Verification {
    verification_id: string;
    verified_by: string;
    verified_at: string;
    verification_observations: string;
    is_approved: boolean;
};
