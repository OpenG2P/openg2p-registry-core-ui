"use client";

import { useState } from "react";

export default function FilterDropdown({
    filters = ["Date", "Name", "Value", "Label"],
    onApply,
}: {
    filters?: readonly string[];
    onApply: () => void;
}) {
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const applyFilters = () => {
        alert(`Filter applied: ${selectedFilter} from ${fromDate} to ${toDate}`);
        onApply();
    };

    return (
        <div className="flex divide-x">
            <div className="flex flex-col gap-4 p-4  w-full text-sm text-gray-700">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`text-left px-2 py-1 rounded ${filter === selectedFilter ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="flex flex-col p-4 flex-1 space-y-4">
                {selectedFilter === "Date" && (
                    <>
                        <div className="text-lg font-semibold">Search by date</div>

                        <div className="flex gap-4 items-center">
                            <label className="w-20 text-sm">From</label>
                            <input
                                type="date"
                                className="border rounded px-2 py-1"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="w-20 text-sm">To</label>
                            <input
                                type="date"
                                className="border rounded px-2 py-1"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <button
                    onClick={applyFilters}
                    className="self-start bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
