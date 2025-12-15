"use client";

import { BreadcrumbBar, PaginationBar } from "@/components/shared";
import { FilterBar } from "@/features/filter/components";

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
    appliedFilters = {},
    filterConfig = [],
    filterLoading = false,
}: any) {
    return (
        <div className="w-full bg-white shadow-sm px-4 h-[60px] flex justify-between items-center">

            <BreadcrumbBar breadcrumb={breadcrumb} />
            <div className="flex items-center gap-2">
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
    );
}
