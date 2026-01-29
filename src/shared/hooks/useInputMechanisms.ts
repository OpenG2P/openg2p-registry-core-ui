import { useRegister } from '@/context/RegisterContext';
import { useFetch } from '@/shared/hooks/useFetch';

export interface InputMechanism {
    mechanism_id: string;
    mechanism_type: string;
    display_key: string;
}

export const useInputMechanisms = () => {
    const { currentRegister } = useRegister();
    const registerId = currentRegister?.register_id;

    const { data, loading } = useFetch<InputMechanism[]>({
        url: '/api/ui-helper/get-input-mechanisms',
        enabled: !!registerId,
        options: {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
            }),
        },
    });

    return {
        mechanisms: data ?? [],
        isLoadingMechanisms: loading,
    };
};
