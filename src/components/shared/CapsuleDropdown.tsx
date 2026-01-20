'use client';

import { useClickOutside } from "@/shared/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CapsuleDropdownProps {
    label: string;
    items: string[];
    value?: string;
    onChange?: (value: string) => void;
    onOpen?: () => void;
}

export default function CapsuleDropdown(props: CapsuleDropdownProps) {
    const { label, items, value, onChange, onOpen } = props;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setOpen(false), open);

    useEffect(() => {
        if (value !== undefined) {
            setSelected(value);
        }
    }, [value]);

    function handleSelect(value: string) {
        setSelected(value);
        setOpen(false);
        onChange?.(value);
    }

    function handleToggle() {
        if (!open) {
            onOpen?.();
        }
        setOpen(!open);
    }

    return (
        <div ref={dropdownRef} className="relative flex items-center gap-3 w-fit">
            <span className="text-[16px] text-black font-medium whitespace-nowrap">
                {label}
            </span>

            <div
                onClick={handleToggle}
                className="flex items-center justify-between gap-3 px-3 py-1 rounded-[17px] cursor-pointer bg-white border border-[#F77F57]"
            >
                <span className="text-[16px] text-black/50 font-medium">
                    {selected ?? "Select"}
                </span>

                <Image
                    src="/down_arrow.png"
                    alt="open"
                    width={14}
                    height={14}
                />
            </div>

            {open && (
                <div
                    className="absolute right-0 top-0 rounded-[17px] bg-white border border-[#F77F57] z-50 overflow-hidden"
                    style={{ transform: "translateY(0)" }}
                >
                    <div
                        onClick={() => {
                            setSelected(undefined);
                            setOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-1 cursor-pointer"
                    >
                        <span className="text-[16px] text-black/50 font-medium">
                            Select
                        </span>
                        <Image
                            src="/down_arrow.png"
                            alt="open"
                            width={14}
                            height={14}
                            className="rotate-180"
                        />
                    </div>
                    {items.map((item, index) => (
                        <div
                            key={item}
                            onClick={() => handleSelect(item)}
                            className="flex items-center gap-3 px-3 py-1 cursor-pointer"
                        >
                            <span className="text-[16px] text-black/50 font-medium">
                                {item}
                            </span>
                            <Image
                                src="/down_arrow.png"
                                alt="open"
                                width={14}
                                height={14}
                                className={index === 0 ? "opacity-100 rotate-180" : "opacity-0"}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
