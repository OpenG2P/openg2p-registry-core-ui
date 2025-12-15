"use client";

import { useEffect, useState } from "react";
import { fetchFilterConfig } from "@/features/filter/utils";
import { AppliedFilters, FilterConfig } from "@/features/filter/types";

export function useRegistryFilters() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>([]);
    const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
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
        setAppliedFilters(filters);
    };

    const removeFilter = (index: number) => {
        setAppliedFilters(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllFilters = () => setAppliedFilters([]);

    return {
        appliedFilters,
        filterConfig,
        filterLoading: loading,
        applyFilters,
        removeFilter,
        clearAllFilters,
    };
}