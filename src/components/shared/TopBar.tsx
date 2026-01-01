"use client";

import { BreadcrumbBar, PaginationBar } from "@/components/shared";
import { FilterBar } from "@/features/filter/components";
import { FilterConfig, FilterRule } from "@/features/filter/types";
import { SearchBar } from "@/components/ui";


interface TopBarProps {
    breadcrumb?: any[];
    showFilters?: boolean;
    showPagination?: boolean;
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearch?: (value: string) => void;

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
    showSearch = true,
    searchPlaceholder = "Search...",
    searchValue = "",
    onSearch,
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
        <div className="w-full px-4 sm:px-6 h-[70px] flex justify-between items-center">
            <BreadcrumbBar breadcrumb={breadcrumb} />
            <div className="flex items-center gap-2 sm:gap-4">
                {showSearch === true && (
                    <div className=" border border-[#ED7C22] min-w-[200px] max-w-[250px] rounded-4xl h-[30px] flex items-center overflow-hidden bg-[#FFFFFF]">
                        <SearchBar
                            placeholder={searchPlaceholder}
                            category=""
                            searchValue={searchValue}
                            iconSize={16}
                            onSearch={(value) => onSearch?.(value)}
                        />
                    </div>
                )}
                {showFilters === true && (
                    <FilterBar
                        onFilters={onFilters}
                        onApplyFilters={onApplyFilters}
                        appliedFilters={appliedFilters}
                        filterConfig={filterConfig}
                        filterLoading={filterLoading}
                    />
                )}

                {showPagination === true && (
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
