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
  if (appliedFilters.length === 0) return null;

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
    <div className="bg-white px-4 py-2 flex flex-wrap items-center gap-4 border-t border-gray-300 shadow-sm">
      <span className="font-semibold text-gray-700">Selected filters</span>

      {appliedFilters.map((filter, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-200 rounded-md px-3 py-1 text-sm gap-2"
        >
          <span>{getFilterLabel(filter)}</span>

          <button
            onClick={() => removeFilter(index)}
            className="text-gray-600 hover:text-gray-900 font-bold"
            aria-label={`Remove filter`}
          >
            <Image src="/close.png" width={16} height={16} alt="clear" />
          </button>
        </div>
      ))}

      <button onClick={clearAllFilters} className="text-sm font-semibold text-black">
        Clear All
      </button>
    </div>
  );
}