"use client";

import Image from "next/image";
import { SelectOption, ValueInputProps } from "@/features/filter/types";

interface SelectFilterInputProps extends ValueInputProps {
    options_source?: SelectOption[];
}

export default function SelectFilterInput({
    value,
    operator,
    onChange,
    options_source = [],
}: SelectFilterInputProps) {
    const isMultiSelect = operator === "in" || operator === "nin";

    const handleMultiSelectChange = (optionValue: string) => {
        const currentValues = Array.isArray(value) ? value : [];

        if (currentValues.includes(optionValue)) {
            onChange(currentValues.filter(v => v !== optionValue));
        } else {
            onChange([...currentValues, optionValue]);
        }
    };

    if (isMultiSelect) {
        const selectedValues = Array.isArray(value) ? value : [];

        return (
            <div className="border rounded-lg p-3 w-full space-y-2">
                {options_source.length === 0 ? (
                    <p className="text-sm text-gray-500">No options available</p>
                ) : (
                    options_source.map(opt => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(opt.value)}
                                onChange={() => handleMultiSelectChange(opt.value)}
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm">{opt.label}</span>
                        </label>
                    ))
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <select
                className="border rounded-lg px-3 py-2 text-sm w-full appearance-none bg-white pr-10 outline-0"
                value={value || ""}
                onChange={e => onChange(e.target.value)}
            >
                <option value="">Select</option>
                {options_source.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Image
                    src="/images/common/down_arrow.png"
                    alt=""
                    width={14}
                    height={14}
                    className=""
                />
            </div>
        </div>
    );
}
