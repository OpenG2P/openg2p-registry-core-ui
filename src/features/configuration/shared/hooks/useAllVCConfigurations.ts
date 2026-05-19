import { useFetch } from '@/shared/hooks';

export interface VCConfiguration {
    vc_config_id: string;
    register_id: string;
    intake_form_id: string;
    data_model_id: string;
    vc_mnemonic: string;
    descriptor_schema: Record<string, unknown>;
}

export function useAllVCConfigurations(
    registerId: string,
    currentPage: number = 1,
    pageSize: number = 10,
) {
    const { data, loading, error, execute } = useFetch<{
        vc_configurations: VCConfiguration[];
        pagination?: {
            number_of_items: number;
            number_of_pages: number;
        };
    }>({
        url: '/api/input-mechanism/get-all-vc-configuration',
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
        vcConfigurations: data?.vc_configurations || [],
        pagination: data?.pagination,
        loading,
        error,
        refresh: execute,
    };
}
