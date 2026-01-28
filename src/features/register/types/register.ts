
export interface DisplayField {
    field_name: string;
    value: string;
    order: number;
}

export interface RegisterRecord {
    internal_record_id: string;
    functional_record_id: string;
    record_name: string;
    record_image_url: string | null;
    display_fields: DisplayField[];

}

export interface PaginationResponse {
  current_page?: number;
  page_size?: number;
  number_of_items?: number;
  number_of_pages?: number;
}

export interface RegisterRecordsApiResponse {
    records: RegisterRecord[];
    pagination: PaginationResponse;
}

export interface RegisterFlattenedRecord {
    internal_record_id: string;
    functional_record_id: string;
    [key: string]: unknown;
}

export interface TabSectionData {
    section_register_id: string;
    records: RegisterFlattenedRecord[];
    is_list: boolean

}

export interface TabSection {
    section_register_id: string;
    register_id: string;
    section_id: string;
    tab_id: string;
    section_mnemonic: string;
    section_description: string;
    documents_required: boolean;
    section_order: number;
    section_ui_schema: any; // UISchema
}

export interface SectionData {
    internal_record_id: string;
    functional_record_id: string;
    link_internal_record_id: string;
    foundational_id: string;
    link_foundational_id: string;
    created_by: string;
    created_at: string;
    last_approved_at: string;
    last_approved_by: string;
    additionalProp1: Record<string, unknown>;
}
