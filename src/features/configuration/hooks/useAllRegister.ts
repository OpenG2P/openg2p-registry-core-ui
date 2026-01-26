import { useFetch } from '@/shared/hooks';
import { Register } from '../types';

export function useAllRegister() {
    const { data, loading, error, execute } = useFetch<Register[]>({
        url: '/api/configuration/registers/all',
    });

    return {
        registers: data || [],
        loading,
        error,
        refresh: execute,
    };
}
