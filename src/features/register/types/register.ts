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

// Representing external type as any to avoid tight coupling in shared types if possible, 
// or import it if the project structure allows. 
// Given the previous file had imports like @openg2p/registry-widgets, it should be fine.
// But safely, I will use 'any' for section_ui_schema here or define a minimal interface?
// The user code imported { UISchema }.
// I'll stick to 'any' for simplicity in shared types or try to import.
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
