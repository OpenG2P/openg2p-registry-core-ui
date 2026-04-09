'use client';

import { useClickOutside } from "@/shared/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface CapsuleDropdownProps {
    label: string;
    items: string[];
    value?: string;
    onChange?: (value: string) => void;
    onOpen?: () => void;
    emptyMessage?: string;
    maxWidth?: string;
}

export default function CapsuleDropdown(props: CapsuleDropdownProps) {
    const t = useTranslations();
    const { label, items, value, onChange, onOpen, emptyMessage, maxWidth } = props;
    const fallbackEmptyMessage = emptyMessage || t('no_items_available');

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

            {/* <div ref={dropdownRef} className="relative w-35 z-10"> */}
            <div ref={dropdownRef} className={`relative z-10 ${maxWidth || 'w-35'}`}>
                <div
                    onClick={handleToggle}
                    className={`w-full flex items-center justify-between gap-2.5 px-4 py-1 bg-white border border-[#ED7C22] rounded-[10px] truncate ${open ? 'border-b-transparent rounded-b-none ' : ''}`}
                    title={selected}
                >
                    <span className={`text-[16px] font-medium ${open ? 'text-[#1E1E1E]/50' : 'text-[#1E1E1E]'} truncate`}>
                        {selected ?? t('select')}
                    </span>

                    <Image
                        src="/images/common/down_arrow.png"
                        alt="open"
                        width={14}
                        height={8}
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                </div>

                {open && (
                    <div className="absolute left-0 py-1 top-full w-full bg-white border border-[#ED7C22] border-t-0 rounded-b-[10px] overflow-hidden">
                        {(
                            items.length === 0 ?
                                (
                                    // <div className="flex items-center gap-3 px-3 py-1">
                                    //     <span className="text-[16px] text-[#1E1E1E]/50 font-medium truncate">
                                    //         {fallbackEmptyMessage}
                                    //     </span>
                                    // </div>
                                    <div className="px-4 py-3 text-[16px] text-[#1E1E1E] truncate" title={fallbackEmptyMessage}>
                                        {fallbackEmptyMessage}
                                    </div>
                                )
                                : (
                                    items.map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => handleSelect(item)}
                                            className="px-4 py-1 text-[16px] cursor-pointer hover:bg-[#F3F1E4] text-[#1E1E1E] font-medium truncate"
                                            title={item}
                                        >
                                            {/* <span className="text-[16px] text-[#1E1E1E]/50 font-medium"> */}
                                            {item}
                                            {/* </span> */}
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