"use client";

import Image from "next/image";

interface SelectedFiltersProps {
  appliedFilters: Record<string, string>;
  removeFilter: (key: string) => void;
  clearAllFilters: () => void;
}

export default function SelectedFilters({
  appliedFilters,
  removeFilter,
  clearAllFilters,
}: SelectedFiltersProps) {
  if (Object.keys(appliedFilters).length === 0) return null;

  return (
    <div className="bg-white px-4 py-2 flex flex-wrap items-center gap-4 border-t border-gray-300 shadow-sm">
      <span className="font-semibold text-gray-700">Selected filters</span>

      {Object.entries(appliedFilters).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center bg-gray-200 rounded-md px-3 py-1 text-sm gap-2"
        >
          <span>
            {key}: <b>{value}</b>
          </span>

          <button
            onClick={() => removeFilter(key)}
            className="text-gray-600 hover:text-gray-900 font-bold"
            aria-label={`Remove filter ${key}`}
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

