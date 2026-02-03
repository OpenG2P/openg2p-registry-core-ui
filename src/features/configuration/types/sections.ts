export interface Section {
    section_id: string;
    section_mnemonic: string;
    section_description: string;
    documents_required?: boolean;
    no_of_verifications_required?: number;
    auto_approval?: boolean;
    is_list?: boolean;
    is_primary_section?: boolean;
    section_register_id?: string;
    section_ui_schema?: any
}
