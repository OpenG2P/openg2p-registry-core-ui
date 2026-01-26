"use client";

import { useEffect, useState } from "react";
import { FilterConfig, FilterRule } from "@/features/filter/types";

import {
    TextFilterInput,
    NumberFilterInput,
    DateFilterInput,
    SelectFilterInput,
} from "@/features/filter/components";
import { validateFilters } from "@/features/filter/utils";


interface FilterDropdownProps {
    onApply: (filters: FilterRule[]) => void;
    appliedFilters?: FilterRule[];
    filterConfig?: FilterConfig[];
}

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

export default function FilterDropdown({
    onApply,
    appliedFilters = [],
    filterConfig = [],
}: FilterDropdownProps) {
    const [selectedFieldName, setSelectedFieldName] = useState("");
    const [operator, setOperator] = useState("");
    const [value, setValue] = useState<any>("");
    const [error, setError] = useState<string | null>(null);

    const configMap: Record<string, FilterConfig> = Object.fromEntries(
        filterConfig.map(cfg => [cfg.field_name, cfg])
    );

    const sortedConfig = [...filterConfig].sort((a, b) => a.order - b.order);

    useEffect(() => {
        setError(null);
    }, [selectedFieldName, operator, value]);


    useEffect(() => {
        if (!selectedFieldName && sortedConfig.length > 0) {
            setSelectedFieldName(sortedConfig[0].field_name);
        }
    }, [sortedConfig, selectedFieldName]);

    const selectedFilter = sortedConfig.find(f => f.field_name === selectedFieldName);

    useEffect(() => {
        if (!selectedFilter) return;

        const firstOperator = selectedFilter.allowed_operators[0] || "";
        setOperator(firstOperator);
    }, [selectedFieldName, selectedFilter]);

    useEffect(() => {
        if (!selectedFilter || !operator) {
            setValue("");
            return;
        }

        const existing = appliedFilters.find(
            f => f.field_name === selectedFilter.field_name && f.operator === operator
        );

        setValue(existing ? existing.value : "");
    }, [selectedFilter, operator, appliedFilters]);

    const applyFilter = () => {
        if (!selectedFilter || !operator) return;

        const newFilter: FilterRule = {
            field_name: selectedFilter.field_name,
            operator,
            value,
        };

        const updatedFilters = [
            ...appliedFilters.filter(
                f => !(f.field_name === newFilter.field_name && f.operator === newFilter.operator)
            ),
            newFilter,
        ];

        const validationErrors = validateFilters(updatedFilters, configMap);

        if (validationErrors.length > 0) {
            const currentError = validationErrors.find(
                e => e.filterId === selectedFilter.field_name
            );

            if (currentError) {
                setError(currentError.message);
                return;
            }
        }

        setError(null);
        onApply(updatedFilters);
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

        switch (selectedFilter.filter_type) {
            case "text":
                return <TextFilterInput {...commonProps} />;

            case "number_range":
                return <NumberFilterInput {...commonProps} />;

            case "date_range":
                return <DateFilterInput {...commonProps} />;

            case "dropdown":
                return (
                    <SelectFilterInput
                        {...commonProps}
                        options_source={selectedFilter.options_source}
                    />
                );

            case "boolean":
                return (
                    <select
                        className="border rounded-lg px-3 py-2 text-sm w-full"
                        value={value === true ? "true" : value === false ? "false" : ""}
                        onChange={e => {
                            if (e.target.value === "") return setValue("");
                            setValue(e.target.value === "true");
                        }}
                    >
                        <option value="">Select</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden min-w-[440px]">
            <div className="w-40 bg-gray-50 p-3 space-y-1">
                {sortedConfig.map(filter => (
                    <button
                        key={filter.field_name}
                        onClick={() => setSelectedFieldName(filter.field_name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm
              ${filter.field_name === selectedFieldName
                                ? "bg-[#F2BA1A] text-black"
                                : "hover: bg-[#F2BA2D] text-black"}`}
                    >
                        {filter.display_label}
                    </button>
                ))}
            </div>

            <div className="w-px bg-gray-200 my-4" />

            <div className="flex-1 p-5 space-y-6 justify-center">
                <div className="text-xl font-semibold">
                    {selectedFilter && `Search by ${selectedFilter.display_label.toLowerCase()}`}
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
                                {selectedFilter.allowed_operators.map(op => (
                                    <option key={op} value={op}>
                                        {OPERATOR_LABELS[op] ?? op}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="w-20 text-sm font-medium">Value</label>
                            {renderValueInput()}
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 ml-20">
                                {error}
                            </p>
                        )}

                    </>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={applyFilter}
                        className="bg-black text-white px-5 py-2.5 rounded-lg text-sm text-center"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
