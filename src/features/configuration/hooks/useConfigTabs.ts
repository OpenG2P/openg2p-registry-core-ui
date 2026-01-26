import { useFetch } from '@/shared/hooks';
import { Tab } from '../types';
import { refresh } from 'next/cache';

export function useConfigTabs(registerId: string) {
    const { data, loading, error, execute } = useFetch<Tab[]>({
        url: '/api/register/tabs',
        options: {
            method: 'POST',
            body: JSON.stringify({ register_id: registerId })
        }
    });

    return {
        tabs: data || [],
        loading,
        error,
        refresh:execute
    };
}
