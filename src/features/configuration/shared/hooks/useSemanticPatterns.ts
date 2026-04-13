import { useFetch } from '@/shared/hooks';

export interface IncomingSemanticPattern {
    semantic_pattern_id: string;
    data_model_id: string;
    register_id: string;
    section_id: string;
    pattern_for_register: string;
    pattern_for_section: string;
    key_path_for_business_payload: string;
    raw_payload_enricher_class: string;
}

export function useSemanticPatterns(page?: number, pageSize?: number) {
    const { data, loading, error, execute } = useFetch<{
        semantic_patterns: IncomingSemanticPattern[];
        pagination?: {
            number_of_items: number;
            number_of_pages: number;
        };
    }>({
        url: '/api/configuration/ingest/get-semantic-pattern',
        options: {
            method: 'POST',
            body: JSON.stringify({
                current_page: page,
                page_size: pageSize
            })
        }
    });

    const semanticPatterns = data?.semantic_patterns || [];

    return {
        semanticPatterns,
        pagination: data?.pagination,
        loading,
        error,
        refresh: execute,
    };
}
