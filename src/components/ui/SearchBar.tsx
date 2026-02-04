"use client";

import { useState } from "react";
import Image from "next/image";

interface SearchBarProps {
    placeholder: string;
    searchValue?: string;
    category: string;
    onSearch: (value: string, category: string) => void;
    iconSize?: number;
    pxClass?: string;
}

const SearchBar = ({ placeholder, searchValue, category, onSearch, iconSize = 24, pxClass = "px-2" }: SearchBarProps) => {
    const [value, setValue] = useState(searchValue || "");

    return (
        <div className={`flex flex-1 items-center ${pxClass} py-1`}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(value, category)}
                className="border-none outline-none flex-1 bg-transparent px-2 pl-3 py-0 text-[20px] font-normal text-[#1E1E1E] placeholder-[#00000080]"
            />

            <button
                onClick={() => onSearch(value, category)}
                className="pl-1 pr-3 text-[#1E1E1E]"
            >
                <Image
                    src="/search_icon.png"
                    width={iconSize}
                    height={iconSize}
                    alt="Search"
                />
            </button>
        </div>
    );
};

export default SearchBar;
