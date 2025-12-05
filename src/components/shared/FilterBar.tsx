"use client";

import Image from "next/image";

export default function FilterBar({ onFilters }: any) {
    return (
        <button
            onClick={onFilters}
            className="h-[30px] flex items-center gap-16 px-3 border rounded bg-white text-sm hover:bg-gray-100"
        >
            <span>Filters</span>
            <Image src="/filter_icon.png" width={16} height={16} alt="filters" />
        </button>
    );
}
