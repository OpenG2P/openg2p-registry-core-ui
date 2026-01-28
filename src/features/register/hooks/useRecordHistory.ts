import { useFetch } from "@/shared/hooks/useFetch";

interface useRecordHistoryParams {
    register_id?: string;
    internal_record_id?: string;
    tab_id?: string;
    truncated_created_date?: string | null;
}

export const useRecordHistory = (params: useRecordHistoryParams) => {
    const {
        data: datesData,
        loading: loadingDates,
    } = useFetch<{ dates: string[] }>({
        url: "/api/register/get-version-dates",
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: params.register_id,
                internal_record_id: params.internal_record_id,
                tab_id: params.tab_id,
            }),
        },
    });

    const {
        data: changesData,
        loading: loadingChanges,
    } = useFetch<any>({
        url: "/api/register/get-versions-for-date",
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: params.register_id,
                internal_record_id: params.internal_record_id,
                tab_id: params.tab_id,
                truncated_created_date: params.truncated_created_date,
            }),
        },
    });

    return {
        datesData,
        changesData,
        loadingDates,
        loadingChanges,
    };
};
