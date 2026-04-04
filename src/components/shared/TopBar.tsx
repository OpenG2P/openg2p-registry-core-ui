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
    searchValue?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    pxClass?: string;

    showCapsule?: boolean;
    capsule?: React.ReactNode;

    subHeading?: string | React.ReactNode;
    showSubHeading?: boolean;


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

    showSecondaryButton?: boolean;
    secondaryButtonText?: string;
    onSecondaryButton?: () => void;

    appliedFilters?: FilterRule[];
    filterConfig?: FilterConfig[];
    filterLoading?: boolean;
}

export default function TopBar({
    breadcrumb = [],
    showSearch = false,
    searchValue = '',
    searchPlaceholder = 'Search',
    onSearch,
    pxClass,
    showFilters = true,
    showPagination = true,
    showCapsule = false,
    showSubHeading = false,
    subHeading,
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
    showSecondaryButton = false,
    secondaryButtonText,
    onSecondaryButton,
    appliedFilters = [],
    filterConfig = [],
    filterLoading = false,
}: TopBarProps) {
    return (
        <div className="w-full h-17.5 flex justify-center items-center">
            <div className="w-full px-7.5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {breadcrumb && breadcrumb.length > 0 && (
                        <BreadcrumbBar breadcrumb={breadcrumb} />
                    )}

                    {showCapsule && capsule}

                    {showSubHeading && subHeading && (
                        <div className="text-[20px] text-[#ED7C22] font-medium">
                            {subHeading}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {showSearch && onSearch && (
                        <div className="ml-auto shrink-0 border border-[#ED7C22] rounded-[10px] h-8.5 flex items-center bg-white">
                            <SearchBar
                                placeholder={searchPlaceholder}
                                category=""
                                searchValue={searchValue}
                                iconSize={16}
                                onSearch={onSearch}
                                pxClass={pxClass}
                                textClass="text-[16px]"
                            />
                        </div>
                    )}
                    {showFilters && (
                        <FilterBar
                            onFilters={onFilters}
                            onApplyFilters={onApplyFilters}
                            appliedFilters={appliedFilters}
                            filterConfig={filterConfig}
                            filterLoading={filterLoading}
                        />
                    )}

                    {showSecondaryButton && (
                        <button
                            onClick={onSecondaryButton}
                            className="h-8.5 px-6 bg-[#F2BA1A] rounded-[10px] flex items-center gap-2 "
                        >
                            <span className="text-[16px] font-medium text-black truncate overflow-hidden whitespace-nowrap">
                                {secondaryButtonText}
                            </span>
                            <span className=" text-[20px] font-bold text-black leading-none">
                                +
                            </span>
                        </button>
                    )}

                    {showAddNewButton && (
                        <button
                            onClick={onAddNewButton}
                            className="h-8.5 px-6 bg-[#F2BA1A] rounded-[10px] flex items-center gap-2 "
                        >
                            <span className="text-[16px] font-medium text-black truncate overflow-hidden whitespace-nowrap">
                                {addNewButtonText}
                            </span>
                            <span className=" text-[20px] font-bold text-black leading-none ">
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
