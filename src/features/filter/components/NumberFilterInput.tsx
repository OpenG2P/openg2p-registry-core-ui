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
            <div className="flex items-center gap-2 w-full font-['Roboto']">
                <input
                    type="number"
                    className="border border-secondary-second rounded-[10px] px-3 text-[16px] font-normal w-1/2 outline-0 h-[36px] text-neutral-first/50"
                    placeholder="Min"
                    value={min || ""}
                    onChange={e => onChange([e.target.value, max])}
                />
                <span className="text-secondary-third">-</span>
                <input
                    type="number"
                    className="border border-secondary-second rounded-[10px] px-3 text-[16px] font-normal w-1/2 outline-0 h-[36px] text-neutral-first/50"
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
            className="border border-secondary-second rounded-[10px] px-3 text-[16px] font-normal w-full outline-0 h-[36px] text-neutral-first/50 font-['Roboto']"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        />
    );
}
