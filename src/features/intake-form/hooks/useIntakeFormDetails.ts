import { useFetch } from "@/shared/hooks/useFetch";
import { IntakeFormSection } from "../types/intake-form";

export const useIntakeFormDetails = (registerId?: string, intakeFormId?: string) => {
    const { data, loading, error } = useFetch<IntakeFormSection[]>({
        url:"/api/intake-form/new/get",
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: registerId,
                intake_form_id: intakeFormId
            }),
        },
        enabled: !!(registerId && intakeFormId),
    });

    return {
        sections: data,
        loading,
        error,
    };
};
