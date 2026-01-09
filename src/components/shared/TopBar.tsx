"use client";

import { BreadcrumbBar, PaginationBar } from "@/components/shared";
import { FilterBar } from "@/features/filter/components";
import { FilterConfig, FilterRule } from "@/features/filter/types";

interface TopBarProps {
    breadcrumb?: any[];
    showFilters?: boolean;
    showPagination?: boolean;

    pageStart: number;
    pageEnd: number;
    total: number;

    onPrev: () => void;
    onNext: () => void;

    onFilters?: () => void;
    onApplyFilters?: (filters: FilterRule[]) => void;

    appliedFilters?: FilterRule[];
    filterConfig?: FilterConfig[];
    filterLoading?: boolean;
}

export default function TopBar({
    breadcrumb = [],
    showFilters = true,
    showPagination = true,
    pageStart,
    pageEnd,
    total,
    onPrev,
    onNext,
    onFilters,
    onApplyFilters,
    appliedFilters = [],
    filterConfig = [],
    filterLoading = false,
}: TopBarProps) {
    return (
        <div className="w-full h-[70px] flex justify-center items-center">
            <div className="w-full px-[30px] flex justify-between items-center">
                <BreadcrumbBar breadcrumb={breadcrumb} />
                <div className="flex items-center gap-2 sm:gap-4">
                    {showFilters && (
                        <FilterBar
                            onFilters={onFilters}
                            onApplyFilters={onApplyFilters}
                            appliedFilters={appliedFilters}
                            filterConfig={filterConfig}
                            filterLoading={filterLoading}
                        />
                    )}

                    {showPagination && (
                        <PaginationBar
                            pageStart={pageStart}
                            pageEnd={pageEnd}
                            total={total}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
