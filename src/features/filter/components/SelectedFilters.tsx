"use client";

import Image from "next/image";
import { FilterConfig, FilterRule } from "@/features/filter/types";

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
};

interface SelectedFiltersProps {
  appliedFilters: FilterRule[];
  filterConfig: FilterConfig[];
  removeFilter: (index: number) => void;
  clearAllFilters: () => void;
}

export default function SelectedFilters({
  appliedFilters,
  filterConfig,
  removeFilter,
  clearAllFilters,
}: SelectedFiltersProps) {
  const getFilterLabel = (rule: FilterRule) => {
    const config = filterConfig.find((f) => f.field_name === rule.field_name);

    let valueLabel = rule.value;
    if (Array.isArray(rule.value)) {
      valueLabel = rule.value.join(' - ');
    } else if (config?.filter_type === 'dropdown' && config.options) {
      const option = config.options.find((o) => o.value === rule.value);
      valueLabel = option?.label || rule.value;
    } else if (config?.filter_type === 'boolean' && typeof rule.value === 'boolean') {
      valueLabel = rule.value ? 'True' : 'False';
    }

    return `${config?.display_label}: ${OPERATOR_LABELS[rule.operator] ?? rule.operator} ${valueLabel || ''}`;
  };

  return (
    <div className="bg-white px-4 py-2 mb-2 flex flex-wrap items-center gap-4 ">
      <span className="w-[110px] h-[19px] font-normal text-[16px]  text-black">
        Selected filters
      </span>

      {appliedFilters.length === 0 ? (
        <div className="w-auto h-[34px] flex items-center bg-[#fcf0d6] rounded-full px-3 text-sm">
          <span>None</span>
        </div>
      ) : (
        appliedFilters.map((filter, index) => (
          <div
            key={index}
            className="w-auto h-[34px] flex items-center bg-[#fcf0d6] rounded-full px-3 text-sm gap-2"
          >
            <span>{getFilterLabel(filter)}</span>

            <button
              onClick={() => removeFilter(index)}
              className="font-bold text-black"
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
          className="w-[60px] h-[19px]  font-normal text-[16px] text-[#ED7C22]"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
