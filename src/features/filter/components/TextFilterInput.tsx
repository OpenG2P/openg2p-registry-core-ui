"use client";

import { ValueInputProps } from "@/features/filter/types";

export default function TextFilterInput({
    value,
    onChange,
}: ValueInputProps) {
    return (
        <input
            type="text"
            className="border rounded-lg px-3 py-2 text-sm w-full"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
        />
    );
}
