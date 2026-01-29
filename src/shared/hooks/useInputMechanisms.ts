import { useFetch } from '@/shared/hooks/useFetch';

export interface InputMechanism {
    mechanism_id: string;
    mechanism_type: string;
    display_key: string;
}

export const useInputMechanisms = () => {
    const { data, loading } = useFetch<InputMechanism[]>({
        url: '/api/ui-helper/get-input-mechanisms',
        options: {
            method: 'POST',
            body: JSON.stringify({
                pagination_request: {
                    current_page: 1,
                    page_size: 50,
                    sort_by: '',
                    filter_by: '',
                    search_text: '',
                },
                request_payload: {},
            }),
        },
    });

    return {
        mechanisms: data ?? [],
        isLoading: loading,
    };
};
