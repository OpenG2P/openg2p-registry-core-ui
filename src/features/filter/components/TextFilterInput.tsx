"use client";

import { ValueInputProps } from "@/features/filter/types";

export default function TextFilterInput({
    value,
    onChange,
    placeholder,
}: ValueInputProps) {
    return (
        <input
            type="text"
            className="border border-[#D1D5DB] rounded-[10px] px-3 text-[16px] font-normal w-full outline-0 h-[36px] text-[#00000080] font-['Roboto']"
            placeholder={placeholder || "Search"}
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        />
    );
}
