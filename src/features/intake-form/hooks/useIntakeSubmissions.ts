import { useFetch } from "@/shared/hooks/useFetch";

export const useIntakeSubmissions = (
    registerId?: string,
    params?: {
        searchText?: string;
        currentPage?: number;
        pageSize?: number;
    }
) => {
    const { data, loading } = useFetch<any>({
        url: "/api/intake-form/search-in-intake-form-submission",
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: registerId,
                search_text: params?.searchText,
                current_page: params?.currentPage,
                page_size: params?.pageSize,
            }),
        },
        enabled: !!registerId,
    });
    const submissions = data?.submissions
    const paginationInfo = data?.pagination;

    return {
        submissions,
        paginationInfo,
        loading,
    };
};
