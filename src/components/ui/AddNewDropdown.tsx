'use client';

import { useClickOutside } from "@/shared/hooks";
import Image from "next/image";
import { useRef, useState } from "react";

interface VCOption {
    vc_config_id: string;
    vc_mnemonic: string;
    descriptor_schema: any;
}

interface AddNewDropdownProps {
    vcOptions?: VCOption[];
    onSelectVC?: (vc: VCOption) => void;
    onImportCSV?: () => void;
    onImportPDS?: () => void;
    onImportOthers?: () => void;
}

export default function AddNewDropdown({
    vcOptions = [],
    onSelectVC,
    onImportCSV,
    onImportPDS,
    onImportOthers,
}: AddNewDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => setOpen(false), open);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-2 px-4 py-1 mt-2 rounded-[17px] bg-white ${open ? "" : "border border-[#F77F57]"}`}
            >
                <span className="text-[16px] font-medium text-black">
                    Add New
                </span>
                <Image
                    src="/down_arrow.png"
                    alt="open"
                    width={14}
                    height={8}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-0 mt-1.5 w-45 rounded-[17px] bg-white border border-[#ED7C22] z-50 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-1">
                        <span className="text-[16px] font-medium text-black">
                            Add New
                        </span>
                        <Image
                            src="/down_arrow.png"
                            alt="close"
                            width={14}
                            height={8}
                            className="rotate-180 cursor-pointer"
                            onClick={() => setOpen(false)}
                        />
                    </div>

                    {vcOptions.length > 0 && (
                        <>
                            <SectionHeading title="Add from VC" />
                            {vcOptions.map(vc => (
                                <DropdownItem
                                    key={vc.vc_config_id}
                                    label={vc.vc_mnemonic}
                                    onClick={() => {
                                        onSelectVC?.(vc);
                                        setOpen(false);
                                    }}
                                />
                            ))}
                            {/* <Divider /> */}
                        </>
                    )}

                    {/* IMPORT SECTION */}
                    {/* <SectionHeading title="Import" />
                    <DropdownItem label="CSV" onClick={onImportCSV} />
                    <DropdownItem label="PDS" onClick={onImportPDS} />

                    <Divider />

                    <DropdownItem
                        label="Import from others"
                        onClick={onImportOthers}
                    /> */}
                </div>
            )}
        </div>
    );
}



function DropdownItem({
    label,
    onClick,
}: {
    label: string;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="px-4 py-2 text-[14px] text-black/50 cursor-pointer hover:bg-[#F3F1E4]"
        >
            {label}
        </div>
    );
}

function SectionHeading({ title }: { title: string }) {
    return (
        <div className="px-4 py-2 text-[16px] font-semibold text-black hover:bg-[#F3F1E4]">
            {title}
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-[#ED7C22] my-1" />;
}
