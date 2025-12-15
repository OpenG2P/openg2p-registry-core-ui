"use client";

import { useEffect, useState } from "react";
import { FilterConfig, FilterRule } from "@/features/filter/types";

import {
    TextFilterInput,
    NumberFilterInput,
    DateFilterInput,
    SelectFilterInput,
} from "@/features/filter/components";


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
    const [selectedFilterId, setSelectedFilterId] = useState("");
    const [operator, setOperator] = useState("");
    const [value, setValue] = useState<any>("");

    useEffect(() => {
        if (!selectedFilterId && filterConfig.length > 0) {
            setSelectedFilterId(filterConfig[0].id);
        }
    }, [filterConfig, selectedFilterId]);

    const selectedFilter = filterConfig.find(f => f.id === selectedFilterId);

    useEffect(() => {
        if (!selectedFilter) return;

        const firstOperator = selectedFilter.operators[0]?.value || "";
        setOperator(firstOperator);
    }, [selectedFilterId]);

    useEffect(() => {
        if (!selectedFilter || !operator) {
            setValue("");
            return;
        }

        const existing = appliedFilters.find(
            f => f.field === selectedFilter.field && f.operator === operator
        );

        setValue(existing ? existing.value : "");
    }, [selectedFilter, operator, appliedFilters]);

    const applyFilter = () => {
        if (!selectedFilter || !operator) return;

        if (operator === "between") {
            if (!Array.isArray(value) || !value[0] || !value[1]) return;
        } else if (!value) {
            return;
        }

        const newFilter: FilterRule = {
            field: selectedFilter.field,
            operator,
            value,
        };

        const updatedFilters = appliedFilters.filter(
            f => !(f.field === newFilter.field && f.operator === newFilter.operator)
        );

        onApply([...updatedFilters, newFilter]);
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

        const commonProps = {
            value,
            operator,
            onChange: setValue,
        };

        switch (selectedFilter.type) {
            case "text":
                return <TextFilterInput {...commonProps} />;

            case "number":
                return <NumberFilterInput {...commonProps} />;

            case "date":
                return <DateFilterInput {...commonProps} />;

            case "select":
                return (
                    <SelectFilterInput
                        {...commonProps}
                        options={selectedFilter.options}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden min-w-[440px]">
            <div className="w-40 bg-gray-50 p-3 space-y-1">
                {filterConfig.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilterId(filter.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm
              ${filter.id === selectedFilterId
                                ? "bg-gray-500 text-white"
                                : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="w-px bg-gray-200 my-4" />

            <div className="flex-1 p-5 space-y-6">
                <div className="text-xl font-semibold">
                    {selectedFilter && `Search by ${selectedFilter.label.toLowerCase()}`}
                </div>

                {selectedFilter && (
                    <>
                        <div className="flex gap-4 items-center">
                            <label className="w-20 text-sm font-medium">Operator</label>
                            <select
                                className="border rounded-lg px-3 py-2 text-sm w-full"
                                value={operator}
                                onChange={e => setOperator(e.target.value)}
                            >
                                {selectedFilter.operators.map(op => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="w-20 text-sm font-medium">Value</label>
                            {renderValueInput()}
                        </div>
                    </>
                )}

                <button
                    onClick={applyFilter}
                    className="bg-black text-white px-5 py-2.5 rounded-lg text-sm"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
}
