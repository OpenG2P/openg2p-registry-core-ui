import { useFetch } from '@/shared/hooks';

export interface OutgestTopic {
    topic_id: string;
    register_id: string;
    data_model_id: string;
    websub_topic: string;
    description: string;
}

export function useAllOutgestTopics(page?: number, pageSize?: number) {
    const { data, loading, error, execute } = useFetch<{
        topics: OutgestTopic[];
        pagination?: {
            number_of_items: number;
            number_of_pages: number;
        };
    }>({
        url: '/api/configuration/outgestion-topic/all',
        options: {
            method: 'POST',
            body: JSON.stringify({
                current_page: page,
                page_size: pageSize
            })
        }
    });

    return {
        topics: data?.topics || [],
        pagination: data?.pagination,
        loading,
        error,
        refresh: execute,
    };
}