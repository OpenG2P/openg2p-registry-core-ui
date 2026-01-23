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
    emptyMessage?: string;
}

export default function CapsuleDropdown(props: CapsuleDropdownProps) {
    const { label, items, value, onChange, onOpen, emptyMessage = "No items available" } = props;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setOpen(false), open);

    useEffect(() => {
        if (value !== undefined) {
            setSelected(value);
        } else {
            setSelected(undefined);
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
        <div className="flex items-center gap-3">
            <span className="text-[16px] text-black font-medium whitespace-nowrap">
                {label}
            </span>

            <div ref={dropdownRef} className="relative">
                <div
                    onClick={handleToggle}
                    className={`flex items-center justify-between gap-3 px-3 py-1 min-w-35 w-auto rounded-[17px] cursor-pointer bg-white border border-[#F77F57] ${open ? "invisible" : ""}`}
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
                        className="absolute left-0 top-0 min-w-35 w-auto rounded-[17px] bg-white border border-[#F77F57] z-50 overflow-hidden"
                        style={{ transform: "translateY(0)" }}
                    >
                        <div
                            onClick={() => {
                                setSelected(undefined);
                                setOpen(false);
                            }}
                            className="flex items-center justify-between gap-3 px-3 py-1 cursor-pointer"
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
                        {(
                            items.length === 0 ?
                                (
                                    <div className="flex items-center gap-3 px-3 py-1">
                                        <span className="text-[16px] text-black/50 font-medium">
                                            {emptyMessage}
                                        </span>
                                    </div>
                                )
                                : (
                                    items.map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => handleSelect(item)}
                                            className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-gray-50"
                                        >
                                            <span className="text-[16px] text-black/50 font-medium">
                                                {item}
                                            </span>
                                        </div>
                                    ))
                                )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}