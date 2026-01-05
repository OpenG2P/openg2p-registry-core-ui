"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import FilterDropdown from "./FilterDropdown";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { FilterConfig, FilterRule } from "@/features/filter/types";
import { useTranslations } from 'next-intl';

interface FilterBarProps {
    onFilters?: () => void;
    onApplyFilters?: (filters: FilterRule[]) => void;
    appliedFilters?: FilterRule[];
    filterConfig?: FilterConfig[];
    filterLoading?: boolean;
}

export default function FilterBar({
    onFilters,
    onApplyFilters,
    appliedFilters = [],
    filterConfig = [],
    filterLoading = false
}: FilterBarProps) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setOpen(false), open);

    const handleApply = (filters: FilterRule[]) => {
        setOpen(false);
        if (onFilters) onFilters();
        if (onApplyFilters) onApplyFilters(filters);
    };

    return (
        <div className="relative inline-block items-center" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="h-[30px] flex items-center gap-16 px-3  rounded-[30px] bg-[#F2BA1A] text-sm "
                disabled={filterLoading}
            >   <span className="font-medium text-[16px] leading-none tracking-normal text-[#1E1E1E]">
                    {filterLoading ? t('loading') : t('filters')}
                </span>

                <Image src="/filter_icon.png" width={16} height={16} alt={t('filters')} />
            </button>

            {open && !filterLoading && (
                <div className="absolute -right-15 top-9 mt-3 bg-white border border-gray-200 rounded-[10px] z-50 flex flex-col shadow-lg">
                    <div className="absolute -top-2.5 right-[70px] w-5 h-5 bg-white border-l border-t border-gray-200 rotate-45" />
                    <FilterDropdown
                        onApply={handleApply}
                        appliedFilters={appliedFilters}
                        filterConfig={filterConfig}
                    />
                </div>
            )}
        </div>
    );
}