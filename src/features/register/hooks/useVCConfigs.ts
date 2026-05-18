import { useFetch } from '@/shared/hooks/useFetch';
import { useRegister } from '@/context/RegisterContext';

export interface VCConfig {
    vc_config_id: string;
    register_id: string;
    vc_mnemonic: string;
    descriptor_schema: any;
}

export const useVCConfigs = () => {
    const { currentRegister } = useRegister();
    const registerId = currentRegister?.register_id;

    const { data, loading } = useFetch<any[]>({
        url: '/api/input-mechanism/vc',
        enabled: !!registerId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
            }),
        },
    });

    return {
        vcOptions: data ?? [],
        isLoadingVCs: loading,
    };
};
