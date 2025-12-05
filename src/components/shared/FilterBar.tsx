"use client";

import Image from "next/image";
import { useState } from "react";
import { FilterDropdown } from "@/components/shared";

export default function FilterBar({ onFilters }: { onFilters?: () => void }) {
    const [open, setOpen] = useState(false);


    const handleApply = () => {
        setOpen(false);
        if (onFilters) onFilters();
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="h-[30px] flex items-center gap-16 px-3 border rounded bg-white text-sm hover:bg-gray-100"
            >
                <span>Filters</span>
                <Image src="/filter_icon.png" width={16} height={16} alt="filters" />
            </button>

            {open && (
                <div
                    className="absolute -right-15 top-9 mt-3 bg-white border border-gray-200 rounded-[10px] z-50 flex flex-col shadow-lg"
                >
                    <div className="absolute -top-2.5 right-[70px] w-5 h-5 bg-white border-l border-t border-gray-200 rotate-45" />
                    <FilterDropdown onApply={handleApply} />
                </div>
            )}
        </div>
    );
}
