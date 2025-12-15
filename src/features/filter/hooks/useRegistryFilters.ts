"use client";

import { useEffect, useState } from "react";
import { fetchFilterConfig } from "@/features/filter/utils/filterConfig";

export type AppliedFilters = Record<string, string>;

export function useRegistryFilters() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});
    const [filterConfig, setFilterConfig] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadFilters = async () => {
            setLoading(true);
            try {
                const config = await fetchFilterConfig();
                setFilterConfig(config);
            } finally {
                setLoading(false);
            }
        };
        loadFilters();
    }, []);

    const applyFilters = (filters: AppliedFilters) => {
        setAppliedFilters(prev => ({
            ...prev,
            ...filters,
        }));
    };

    const removeFilter = (key: string) => {
        setAppliedFilters(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const clearAllFilters = () => setAppliedFilters({});

    return {
        appliedFilters,
        filterConfig,
        filterLoading: loading,
        applyFilters,
        removeFilter,
        clearAllFilters,
    };
}
