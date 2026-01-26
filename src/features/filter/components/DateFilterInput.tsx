"use client";

import { ValueInputProps } from "@/features/filter/types";

export default function DateFilterInput({
    value,
    operator,
    onChange,
}: ValueInputProps) {
    if (operator === "between") {
        const [start, end] = Array.isArray(value) ? value : ["", ""];
        return (
            <div className="flex items-center gap-2 w-full">
                <input
                    type="date"
                    className="border rounded-lg px-2 py-2 text-sm w-1/2"
                    value={start || ""}
                    onChange={e => onChange([e.target.value, end])}
                />
                <span className="text-gray-400">-</span>
                <input
                    type="date"
                    className="border rounded-lg px-2 py-2 text-sm w-1/2"
                    value={end || ""}
                    onChange={e => onChange([start, e.target.value])}
                />
            </div>
        );
    }

    return (
        <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm w-full"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        />
    );
}
