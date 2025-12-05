"use client";

import { useState } from "react";

export default function FilterDropdown({
    filters = ["Date", "Name"],
    onApply,
}: {
    filters?: readonly string[];
    onApply: () => void;
}) {
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [nameValue, setNameValue] = useState("");

    const applyFilters = () => {
        let msg = `Filter applied: ${selectedFilter}`;

        if (selectedFilter === "Date") {
            msg += ` | From: ${fromDate} To: ${toDate}`;
        } else if (selectedFilter === "Name") {
            msg += ` | Name: ${nameValue}`;
        }

        alert(msg);
        onApply();
    };

    return (
        <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden min-w-[440px]">

            <div className="flex flex-col gap-1 w-40 bg-gray-50 p-3">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${filter === selectedFilter
                                ? "bg-gray-500 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="flex items-stretch">
                <div className="w-px bg-gray-200 my-4"></div>
            </div>

            <div className="flex flex-col p-5 flex-1 space-y-6">
                <div className="text-xl font-semibold text-gray-800">
                    {selectedFilter === "Date" && "Search by date"}
                    {selectedFilter === "Name" && "Search by name"}
                </div>

                {selectedFilter === "Date" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-medium text-gray-700">From</label>
                            <input
                                type="date"
                                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-medium text-gray-700">To</label>
                            <input
                                type="date"
                                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {selectedFilter === "Name" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                placeholder="Enter name..."
                                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={applyFilters}
                    className="bg-black text-white self-start px-5 py-2.5 rounded-lg text-sm font-medium"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
}
