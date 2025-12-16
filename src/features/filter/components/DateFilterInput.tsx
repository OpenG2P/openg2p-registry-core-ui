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
            <div className="flex gap-2">
                <input
                    type="date"
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                    value={start}
                    onChange={e => onChange([e.target.value, end])}
                />
                <input
                    type="date"
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                    value={end}
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
