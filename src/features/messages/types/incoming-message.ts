export interface IncomingMessage {
    ingest_id: string;
    partner: string;
    data_model: string;
    ingest_datetime: string;
    classification_status: string;
    classification_datetime?: string | null;

    target_register?: string | null;
    operation?: string | null;
    transformation_status?: string | null;
    transformation_datetime?: string | null;

    transformation_template?: string | null;
    ingestion_status?: string | null;
    ingestion_datetime?: string | null;

    change_log_id?: string | null;
}