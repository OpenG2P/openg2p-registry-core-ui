import { useFetch } from "@/shared/hooks/useFetch";
import { IntakeSubmissionPayload } from "../types/intake-form";

export const useIntakeSubmissionDetails = (submissionId?: string) => {
    const { data, loading, error } = useFetch<IntakeSubmissionPayload>({
        url: "/api/intake-form/submission/get",
        options: {
            method: "POST",
            body: JSON.stringify({
                submission_id: submissionId
            }),
        },
        enabled: !!submissionId,
    });

    return {
        submission: data,
        loading,
        error,
    };
};
