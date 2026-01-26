"use client";

import { ValueInputProps } from "@/features/filter/types";

export default function NumberFilterInput({
    value,
    operator,
    onChange,
}: ValueInputProps) {
    if (operator === "between") {
        const [min, max] = Array.isArray(value) ? value : ["", ""];
        return (
            <div className="flex items-center gap-2 w-full">
                <input
                    type="number"
                    className="border rounded-lg px-3 py-2 text-sm w-1/2"
                    placeholder="Min"
                    value={min || ""}
                    onChange={e => onChange([e.target.value, max])}
                />
                <span className="text-gray-400">-</span>
                <input
                    type="number"
                    className="border rounded-lg px-3 py-2 text-sm w-1/2"
                    placeholder="Max"
                    value={max || ""}
                    onChange={e => onChange([min, e.target.value])}
                />
            </div>
        );
    }

    return (
        <input
            type="number"
            className="border rounded-lg px-3 py-2 text-sm w-full"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        />
    );
}
