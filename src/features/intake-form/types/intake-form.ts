export type IntakeFormStatus = 'DRAFT' | 'SUBMITTED' | 'FINALIZED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IntakeForm {
    tab_id: string;
    intake_form_name: string;
}

export interface IntakeFormSection {
    section_register_id: string;
    register_id: string;
    section_id: string;
    tab_id: string;
    section_mnemonic: string;
    section_description: string | null;
    section_ui_schema: any;
    register_relation: string;
    is_list: boolean;
}

export interface IntakeFormSubmission {
    submission_id: string;
    submission_reference: string;
    intake_form_status: IntakeFormStatus;
    approval_status: ApprovalStatus;
    created_at: string;
    created_by: string;
    tab_id: string;
    no_of_verifications_required: number;
    no_of_verifications_done: number;
    foundational_id?: string;
}

export interface IntakeSubmissionPayload {
    submission_id: string;
    submission_reference: number | string;
    register_id: string;
    tab_id: string;
    foundational_id: string;
    link_foundational_id: string;
    intake_form_status: IntakeFormStatus;
    change_request_submission_status: string;
    change_request_id: string | null;
    submission_no_of_attempts: number;
    submission_latest_datetime: string | null;
    submission_latest_error_code: string | null;
    no_of_verifications_required: number;
    no_of_verifications_done: number;
    approval_status: ApprovalStatus;
    approved_by: string | null;
    approved_at: string | null;
    created_by: string;
    created_at: string;
    last_updated_by: string;
    last_updated_at: string;
    section_payloads: {
        section_id: string;
        payload_json: any;
    }[];
}