export interface Register {
    register_id: string;
    register_mnemonic: string;
    register_subject: string;
    register_description: string;
    master_register_id: string | null;
    master_register_mnemonic: string;
    register_purpose?: string;
    register_rank?: number;
    register_icon?: string;
    dedup_is_enabled?: boolean;
    dedup_threshold_score?: number;
    has_data?: boolean;
    has_image?: boolean;
    program_id?: string;
}