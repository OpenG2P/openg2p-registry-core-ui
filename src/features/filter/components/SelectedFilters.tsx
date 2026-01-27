"use client";

import Image from "next/image";
import { FilterConfig, FilterRule } from "@/features/filter/types";
import { SearchBar } from "@/components/ui";

const OPERATOR_LABELS: Record<string, string> = {
    eq: "Equals",
    neq: "Not equals",
    in: "In",
    nin: "Not in",
    contains: "Contains",
    ncontains: "Does not contain",
    startsWith: "Starts with",
    endsWith: "Ends with",
    gt: "Greater than",
    gte: "Greater than or equal",
    lt: "Less than",
    lte: "Less than or equal",
    isNull: "Is null",
    between: "Between",
};

interface SelectedFiltersProps {
    appliedFilters: FilterRule[];
    filterConfig: FilterConfig[];
    removeFilter: (index: number) => void;
    clearAllFilters: () => void;
    searchValue?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
}

export default function SelectedFilters({
    appliedFilters,
    filterConfig,
    removeFilter,
    clearAllFilters,
    searchValue = '',
    searchPlaceholder = 'Search...',
    onSearch
}: SelectedFiltersProps) {
    const getFilterLabel = (rule: FilterRule) => {
        const config = filterConfig.find((f) => f.field_name === rule.field_name);
        let valueLabel = rule.value;
        if (Array.isArray(rule.value)) {
            valueLabel = rule.value.join(' - ');
        } else if (config?.filter_type === 'dropdown' && config.options_source) {
            const option = config.options_source.find((o) => o.value === rule.value);
            valueLabel = option?.label || rule.value;
        } else if (config?.filter_type === 'boolean' && typeof rule.value === 'boolean') {
            valueLabel = rule.value ? 'True' : 'False';
        }

        return `${config?.display_label}: ${OPERATOR_LABELS[rule.operator] ?? rule.operator} ${valueLabel || ''}`;
    };

    return (
        <div className="bg-white px-4 py-4 mb-2 flex items-center rounded-[30px] gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
                <span className="w-27.5 font-normal text-[16px] text-black pl-1">
                    Selected filters
                </span>

                {appliedFilters.length === 0 ? (
                    <div className="h-8.5 flex items-center bg-[#fcf0d6] rounded-full px-3 text-sm">
                        None
                    </div>
                ) : (
                    appliedFilters.map((filter, index) => (
                        <div
                            key={index}
                            className="h-8.5 flex items-center bg-[#fcf0d6] rounded-full px-3 text-sm gap-2"
                        >
                            <span>{getFilterLabel(filter)}</span>
                            <button
                                onClick={() => removeFilter(index)}
                                aria-label="Remove filter"
                            >
                                <Image src="/close.png" width={16} height={16} alt="clear" />
                            </button>
                        </div>
                    ))
                )}

                {appliedFilters.length > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-[#ED7C22] text-sm"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {onSearch && (
                <div className="ml-auto shrink-0 border border-[#ED7C22] rounded-[30px] h-8.5 flex items-center px-2 bg-white">
                    <SearchBar
                        placeholder={searchPlaceholder}
                        category=""
                        searchValue={searchValue}
                        iconSize={16}
                        onSearch={onSearch}
                    />
                </div>
            )}
        </div>
    );
}
