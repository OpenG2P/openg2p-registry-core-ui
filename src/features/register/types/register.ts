import { PaginationResponse } from '@/shared/types';

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
}

// Let's rely on 'any' for section_ui_schema to avoid import issues in shared folder.
export interface TabSection {
    section_register_id: string;
    register_id: string;
    section_id: string;
    tab_id: string;
    section_mnemonic: string;
    section_description: string;
    documents_required: boolean;
    section_ui_schema: any; // UISchema
}
