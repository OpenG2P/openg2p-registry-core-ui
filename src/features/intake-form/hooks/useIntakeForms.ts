import { useFetch } from "@/shared/hooks/useFetch";
import { IntakeForm } from "../types/intake-form";

export const useIntakeForms = (registerId?: string) => {
    const { data, loading, error } = useFetch<IntakeForm[]>({
        url: registerId ? "/api/intake-form/new/list" : null,
        options: {
            method: "POST",
            body: JSON.stringify({ register_id: registerId }),
        },
        enabled: !!registerId,
    });

    return {
        forms: data,
        loading,
        error,
    };
};