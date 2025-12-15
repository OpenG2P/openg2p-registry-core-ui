"use client";

import { useEffect, useState } from "react";

export default function FilterDropdown({
    onApply,
    appliedFilters = {},
    filterConfig = []
}: {
    onApply: (filters: Record<string, string>) => void;
    appliedFilters?: Record<string, string>;
    filterConfig?: any[];
}) {
    const [selectedFilterId, setSelectedFilterId] = useState(
        filterConfig[0]?.id || ""
    );
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});

    useEffect(() => {
        if (filterConfig.length > 0 && !selectedFilterId) {
            setSelectedFilterId(filterConfig[0].id);
        }
    }, [filterConfig, selectedFilterId]);

    useEffect(() => {
        const newValues: Record<string, string> = {};

        filterConfig.forEach(filter => {
            filter.fields?.forEach((field: any) => {
                if (appliedFilters[field.name]) {
                    newValues[field.name] = appliedFilters[field.name];
                }
            });
        });

        setFilterValues(newValues);
    }, [appliedFilters, filterConfig]);

    const handleInputChange = (fieldName: string, value: string) => {
        setFilterValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const applyFilters = () => {
        const selectedFilter = filterConfig.find(f => f.id === selectedFilterId);
        if (!selectedFilter) return;

        const filterData: Record<string, string> = {};

        selectedFilter.fields?.forEach((field: any) => {
            const value = filterValues[field.name] || "";
            if (value) {
                filterData[field.name] = value;
            }
        });

        onApply(filterData);

        const clearedValues: Record<string, string> = { ...filterValues };
        selectedFilter.fields?.forEach((field: any) => {
            delete clearedValues[field.name];
        });
        setFilterValues(clearedValues);
    };

    const selectedFilter = filterConfig.find(f => f.id === selectedFilterId);

    if (filterConfig.length === 0) {
        return (
            <div className="flex items-center justify-center p-10 min-w-[440px]">
                <p className="text-gray-500">Loading filters...</p>
            </div>
        );
    }

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
                        {selectedFilter.fields?.map((field: any) => (
                            <div key={field.name} className="flex items-center gap-4">
                                <label className="w-20 text-sm font-medium text-gray-700">
                                    {field.name}
                                </label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder || ""}
                                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                                    value={filterValues[field.name] || ""}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={applyFilters}
                    className="bg-black text-white self-start px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
}