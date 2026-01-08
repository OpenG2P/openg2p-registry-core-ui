"use client";

import { useEffect, useState } from "react";
import { useFilterConfig, validateFilters } from "@/features/filter/utils";
import { AppliedFilters, FilterConfig, FilterRule } from "@/features/filter/types";

export function useRegistryFilters() {
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>([]);
    const { filterConfig, loading, error } = useFilterConfig();

    const applyFilters = (filters: AppliedFilters) => {
        setAppliedFilters(prev => {
            const map = new Map<string, FilterRule>();

            prev.forEach(f => {
                map.set(`${f.field_name}__${f.operator}`, f);
            });

            filters.forEach(f => {
                map.set(`${f.field_name}__${f.operator}`, f);
            });

            return Array.from(map.values());
        });
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