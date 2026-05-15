import { useFetch } from '@/shared/hooks';

export interface InputMechanism {
    mechanism_id: string;
    register_id: string;
    mechanism_type: string;
    display_key: string;
}

export function useAllInputMechanisms(
    registerId: string,
    currentPage: number = 1,
    pageSize: number = 10,
) {
    const { data, loading, error, execute } = useFetch<{
        input_mechanisms: InputMechanism[];
        pagination?: {
            number_of_items: number;
            number_of_pages: number;
        };
    }>({
        url: '/api/configuration/ingest/get-all-input-mechanisms',
        enabled: !!registerId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                current_page: currentPage,
                page_size: pageSize,
                register_id: registerId,
            }),
        },
    });

    return {
        inputMechanisms: data?.input_mechanisms || [],
        pagination: data?.pagination,
        loading,
        error,
        refresh: execute,
    };
}
