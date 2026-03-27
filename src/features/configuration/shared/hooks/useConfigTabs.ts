import { useFetch } from '@/shared/hooks';
import { Tab } from '../types';

export function useConfigTabs(registerId: string, page: number = 1, pageSize: number = 10) {
    const { data, loading, error, execute } = useFetch<{
        tabs: Tab[];
        pagination?: {
            number_of_items: number;
            number_of_pages: number;
        };
    }>({
        url: '/api/configuration/registers/tabs/get',
        options: {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                page,
                pageSize
            })
        }
    });

    const tabs = [...(data?.tabs || [])]
        .sort((a, b) => (b.tab_order ?? 0) - (a.tab_order ?? 0));

    return {
        tabs,
        pagination: data?.pagination,
        loading,
        error,
        refresh: execute
    };
}

