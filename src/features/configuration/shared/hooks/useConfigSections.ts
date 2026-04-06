import { useFetch } from '@/shared/hooks';
import { Section } from '../types';

export function useConfigSections(registerId: string, tabId: string, page: number = 1, pageSize: number = 10) {
    const { data, loading, error, execute } = useFetch<{
        sections: Section[];
        pagination?: {
            number_of_items: number;
            number_of_pages: number;
        };
    }>({
        url: '/api/configuration/registers/tabs/sections/get',
        options: {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                tab_id: tabId,
                page,
                pageSize
            })
        }
    });

    // Acending Order
    const sections = [...(data?.sections || [])]
        .sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0));

    return {
        sections,
        pagination: data?.pagination,
        loading,
        error,
        refresh: execute
    };
}

