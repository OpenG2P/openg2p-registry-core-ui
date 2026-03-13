import { useFetch } from "@/shared/hooks/useFetch";
import { IntakeFormSubmission } from "../types/intake-form";

export const useIntakeSubmissions = (
    registerId?: string,
    params?: {
        tabId?: string;
        searchText?: string;
        currentPage?: number;
        pageSize?: number;
    }
) => {
    const { data, loading } = useFetch<IntakeFormSubmission[]>({
        url: registerId ? "/api/intake-form/submission/search" : null,
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: registerId,
                tab_id: params?.tabId,
                search_text: params?.searchText,
                current_page: params?.currentPage,
                page_size: params?.pageSize,
            }),
        },
        enabled: !!registerId,
    });

    return {
        submissions: data,
        loading,
    };
};
