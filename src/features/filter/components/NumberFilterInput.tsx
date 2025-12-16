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
            <div className="flex gap-2">
                <input
                    type="number"
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                    value={min}
                    onChange={e => onChange([e.target.value, max])}
                />
                <input
                    type="number"
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                    value={max}
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
