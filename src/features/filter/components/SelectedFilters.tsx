"use client";

import Image from "next/image";
import { FilterConfig, FilterRule } from "@/features/filter/types";

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
    const config = filterConfig.find((f: any) => f.field === rule.field);
    const operator = config?.operators.find((o: any) => o.value === rule.operator);

    let valueLabel = rule.value;
    if (Array.isArray(rule.value)) {
      valueLabel = rule.value.join(' - ');
    } else if (config?.type === 'select' && config.options) {
      const option = config.options.find((o: any) => o.value === rule.value);
      valueLabel = option?.label || rule.value;
    }

    return `${config?.label}: ${operator?.label} ${valueLabel || ''}`;
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
