"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
  category: string;
  onSearch: (value: string, category: string) => void;
}

const SearchBar = ({ placeholder, category, onSearch }: SearchBarProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="  flex flex-1 items-start px-4 py-3">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(value, category)}
        className=" border-none outline-none flex-1 bg-transparent  px-2 py-2 text-gray-700 placeholder-gray-400"
      />

      <button
        onClick={() => onSearch(value, category)}
        className="px-2 text-black mt-2"
      >
        <Search size={24} />
      </button>

    </div>
  );
};

export default SearchBar;
