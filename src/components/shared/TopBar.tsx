"use client";

import { BreadcrumbBar, FilterBar, PaginationBar } from "@/components/shared";

export default function TopBar({
    breadcrumb = [],
    showFilters = true,
    showPagination = true,
    pageStart,
    pageEnd,
    total,
    onPrev,
    onNext,
    onFilters
}: any) {
    return (
        <div className="w-full bg-white border-b border-gray-300 shadow-sm px-4 h-[60px] flex justify-between items-center">

            <BreadcrumbBar breadcrumb={breadcrumb} />

            <div className="flex items-center gap-2">
                {showFilters && <FilterBar onFilters={onFilters} />}

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
