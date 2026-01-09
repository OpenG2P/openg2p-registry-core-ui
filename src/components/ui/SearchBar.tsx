"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder: string;
    searchValue?: string;
    category: string;
    onSearch: (value: string, category: string) => void;
    iconSize?: number;
}

const SearchBar = ({ placeholder, searchValue, category, onSearch, iconSize = 24 }: SearchBarProps) => {
    const [value, setValue] = useState(searchValue || "");

    return (
        <div className="flex flex-1 items-center px-2 py-1">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(value, category)}
                className="border-none outline-none flex-1 bg-transparent px-2 py-0 text-[18px] font-medium text-[#1E1E1E] placeholder-[#00000080]"
            />

            <button
                onClick={() => onSearch(value, category)}
                className="px-1 text-[#1E1E1E]"
            >
                <Search size={iconSize} />
            </button>

        </div>
    );
};

export default SearchBar;
