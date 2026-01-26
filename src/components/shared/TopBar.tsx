"use client";

import { BreadcrumbBar, PaginationBar } from "@/components/shared";
import { FilterBar } from "@/features/filter/components";
import { FilterConfig, FilterRule } from "@/features/filter/types";

interface TopBarProps {
    breadcrumb?: any[];
    showFilters?: boolean;
    showPagination?: boolean;

    showCapsule?: boolean;
    capsule?: React.ReactNode;

    pageStart?: number;
    pageEnd?: number;
    total?: number;

    onPrev?: () => void;
    onNext?: () => void;

    onFilters?: () => void;
    onApplyFilters?: (filters: FilterRule[]) => void;

    showAddNewButton?: boolean;
    onAddNewButton?: () => void;
    addNewButtonText?: string;

    appliedFilters?: FilterRule[];
    filterConfig?: FilterConfig[];
    filterLoading?: boolean;
}

export default function TopBar({
    breadcrumb = [],
    showFilters = true,
    showPagination = true,
    showCapsule = false,
    capsule,
    pageStart,
    pageEnd,
    total,
    onPrev,
    onNext,
    onFilters,
    onApplyFilters,
    showAddNewButton = false,
    onAddNewButton,
    addNewButtonText = "Add New",
    appliedFilters = [],
    filterConfig = [],
    filterLoading = false,
}: TopBarProps) {
    return (
        <div className="w-full h-17.5 flex justify-center items-center">
            <div className="w-full px-7.5 flex justify-between items-center">
                {/* <BreadcrumbBar breadcrumb={breadcrumb} /> */}
                <div className="flex items-center gap-4">
                    {breadcrumb && breadcrumb.length > 0 && (
                        <BreadcrumbBar breadcrumb={breadcrumb} />
                    )}

                    {showCapsule && capsule}
                </div>
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

                    {showAddNewButton && (
                        <button
                            onClick={onAddNewButton}
                            className="h-[34px] px-6 bg-[#F2BA1A] rounded-[17px] flex items-center gap-2 hover:bg-[#e5b018] transition-colors"
                        >
                            <span className="text-[16px] font-medium text-black">
                                {addNewButtonText}
                            </span>
                            <span className=" text-[20px] font-bold text-black leading-none">
                                +
                            </span>

                        </button>
                    )}

                    {showPagination && onPrev && onNext && (
                        <PaginationBar
                            pageStart={pageStart ?? 0}
                            pageEnd={pageEnd ?? 0}
                            total={total ?? 0}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
