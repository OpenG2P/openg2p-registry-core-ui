"use client";

import { useEffect, useState } from "react";
import { FilterConfig, FilterRule } from "@/features/filter/types";

interface FilterDropdownProps {
  onApply: (filters: FilterRule[]) => void;
  appliedFilters?: FilterRule[];
  filterConfig?: FilterConfig[];
}

export default function FilterDropdown({
  onApply,
  appliedFilters = [],
  filterConfig = [],
}: FilterDropdownProps) {
    const [selectedFilterId, setSelectedFilterId] = useState(
        filterConfig[0]?.id || ""
    );
    const [operator, setOperator] = useState("");
    const [value, setValue] = useState<any>("");

    useEffect(() => {
        if (filterConfig.length > 0 && !selectedFilterId) {
            setSelectedFilterId(filterConfig[0].id);
        }
    }, [filterConfig, selectedFilterId]);

    useEffect(() => {
        const selectedFilter = filterConfig.find(f => f.id === selectedFilterId);
        if (selectedFilter && selectedFilter.operators.length > 0) {
            setOperator(selectedFilter.operators[0].value);
        }
        setValue("");
    }, [selectedFilterId, filterConfig]);

    const selectedFilter = filterConfig.find(f => f.id === selectedFilterId);

    const applyFilter = () => {
        if (!selectedFilter || !operator) return;

        if (operator === 'between' && Array.isArray(value)) {
            if (!value[0] || !value[1]) return;
        } else if (!value) {
            return;
        }

        const newFilter: FilterRule = {
            field: selectedFilter.field,
            operator: operator,
            value: value
        };

        onApply([...appliedFilters, newFilter]);

        setValue("");
        if (selectedFilter.operators.length > 0) {
            setOperator(selectedFilter.operators[0].value);
        }
    };

    if (filterConfig.length === 0) {
        return (
            <div className="flex items-center justify-center p-10 min-w-[440px]">
                <p className="text-gray-500">Loading filters...</p>
            </div>
        );
    }

    const renderValueInput = () => {
        if (!selectedFilter) return null;

        if (selectedFilter.type === 'text') {
            return (
                <input
                    type="text"
                    placeholder="Enter value..."
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                    value={value || ""}
                    onChange={(e) => setValue(e.target.value)}
                />
            );
        }

        if (selectedFilter.type === 'number') {
            if (operator === 'between') {
                const [min, max] = Array.isArray(value) ? value : ['', ''];
                return (
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            placeholder="Min"
                            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                            value={min}
                            onChange={(e) => setValue([e.target.value, max])}
                        />
                        <span className="text-sm text-gray-500">and</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                            value={max}
                            onChange={(e) => setValue([min, e.target.value])}
                        />
                    </div>
                );
            }
            return (
                <input
                    type="number"
                    placeholder="Enter number..."
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                    value={value || ""}
                    onChange={(e) => setValue(e.target.value)}
                />
            );
        }

        if (selectedFilter.type === 'date') {
            if (operator === 'between') {
                const [start, end] = Array.isArray(value) ? value : ['', ''];
                return (
                    <div className="flex gap-2 items-center">
                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                            value={start}
                            onChange={(e) => setValue([e.target.value, end])}
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                            value={end}
                            onChange={(e) => setValue([start, e.target.value])}
                        />
                    </div>
                );
            }
            return (
                <input
                    type="date"
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                    value={value || ""}
                    onChange={(e) => setValue(e.target.value)}
                />
            );
        }

        if (selectedFilter.type === 'select') {
            return (
                <select
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                    value={value || ""}
                    onChange={(e) => setValue(e.target.value)}
                >
                    <option value="">Select an option</option>
                    {selectedFilter.options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return null;
    };

    return (
        <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden min-w-[440px]">
            <div className="flex flex-col gap-1 w-40 bg-gray-50 p-3">
                {filterConfig.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilterId(filter.id)}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${filter.id === selectedFilterId
                                ? "bg-gray-500 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="flex items-stretch">
                <div className="w-px bg-gray-200 my-4"></div>
            </div>

            <div className="flex flex-col p-5 flex-1 space-y-6">
                <div className="text-xl font-semibold text-gray-800">
                    {selectedFilter?.label && `Search by ${selectedFilter.label.toLowerCase()}`}
                </div>

                {selectedFilter && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-medium text-gray-700">
                                Operator
                            </label>
                            <select
                                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                                value={operator}
                                onChange={(e) => {
                                    setOperator(e.target.value);
                                    setValue("");
                                }}
                            >
                                {selectedFilter.operators.map(op => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-medium text-gray-700">
                                Value
                            </label>
                            {renderValueInput()}
                        </div>
                    </div>
                )}

                <button
                    onClick={applyFilter}
                    className="bg-black text-white self-start px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
}