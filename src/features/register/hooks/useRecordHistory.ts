import { useState } from "react";
import { useFetch } from "@/shared/hooks/useFetch";

export const useRecordHistory = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const { execute: fetchDates, loading: loadingDates } = useFetch<any>({
        url: "/api/change_request/get_version_dates",
        enabled: false,
    });

    const { execute: fetchChanges, loading: loadingChanges } = useFetch<any>({
        url: "/api/change_request/get_changes_for_date",
        enabled: false,
    });

    const loadDates = async (payload: {
        register_id: string;
        internal_record_id: string;
        tab_id: string;
    }) => {
        return fetchDates("/api/register/get-version-dates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    };

    const loadChanges = async (payload: {
        register_id: string;
        internal_record_id: string;
        tab_id: string;
        truncated_created_date: string;
    }) => {
        setSelectedDate(payload.truncated_created_date);

        return fetchChanges("/api/register/get-changes-for-date", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    };

    return {
        loadDates,
        loadChanges,
        selectedDate,
        loadingDates,
        loadingChanges,
    };
};
