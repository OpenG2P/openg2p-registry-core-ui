interface SelectedFiltersProps {
  title?: string;
  filters: string[];
  onClearFilter?: (filter: string) => void;
  onClearAll?: () => void;
}

export function SelectedFilters({
  title = "Selected filters",
  filters,
  onClearFilter,
  onClearAll,
}: SelectedFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-700">
      <span className="font-bold">{title}</span>
      {filters.map((filter) => (
        <div
          key={filter}
          className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded"
        >
          <span>{filter}</span>
          {onClearFilter && (
            <button
              onClick={() => onClearFilter(filter)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

