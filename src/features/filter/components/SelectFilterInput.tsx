"use client";

import { SelectOption, ValueInputProps } from "@/features/filter/types";

interface SelectFilterInputProps extends ValueInputProps {
    options?: SelectOption[];
}

export default function SelectFilterInput({
    value,
    onChange,
    options = [],
}: SelectFilterInputProps) {
    return (
        <select
            className="border rounded-lg px-3 py-2 text-sm w-full"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        >
            <option value="">Select</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
