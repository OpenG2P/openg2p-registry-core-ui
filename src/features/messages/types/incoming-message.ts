// export interface IncomingMessage {
//     ingest_id: string;
//     partner: string;
//     data_model: string;
//     ingest_datetime: string;
//     classification_status: string;
//     classification_datetime?: string | null;

//     target_register?: string | null;
//     operation?: string | null;
//     transformation_status?: string | null;
//     transformation_datetime?: string | null;

//     transformation_template?: string | null;
//     ingestion_status?: string | null;
//     ingestion_datetime?: string | null;

//     change_log_id?: string | null;
// }

export interface IncomingMessage {
    ingest_id: string;

    partner_id: string;
    data_model_id: string;

    ingest_message_id: string;
    ingest_correlation_id: string;

    receipt_date_time: string;

    classification_status: string;
    classification_date_time?: string | null;
    classification_number_of_attempts?: number;
    classification_latest_error_code?: string | null;

    change_request_id?: string | null;

    register_id?: string | null;
    section_id?: string | null;
    semantic_pattern_id?: string | null;

    transformation_status?: string | null;
    transformation_date_time?: string | null;
    transformation_number_of_attempts?: number;
    transformation_latest_error_code?: string | null;

    ingestion_status?: string | null;
    ingestion_date_time?: string | null;
    ingestion_number_of_attempts?: number;
    ingestion_latest_error_code?: string | null;
}
