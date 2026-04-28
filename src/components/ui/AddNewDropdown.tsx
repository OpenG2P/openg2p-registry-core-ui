'use client';

import { useClickOutside } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface VCOption {
    vc_config_id: string;
    vc_mnemonic: string;
    descriptor_schema: any;
}

interface InputMechanism {
    mechanism_id: string;
    mechanism_type: string;
    display_key: string;
}

interface AddNewDropdownProps {
    vcOptions?: VCOption[];
    mechanisms?: InputMechanism[];
    onSelectVC?: (vc: VCOption) => void;
    onImportCSV?: () => void;
    onImportPDS?: () => void;
    onImportOthers?: () => void;
}

export default function AddNewDropdown({
    vcOptions = [],
    mechanisms = [],
    onSelectVC,
    onImportCSV,
    onImportPDS,
}: AddNewDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    useClickOutside(ref, () => setOpen(false), open);

    return (
        <div ref={ref} className="relative mt-2 w-45 z-10">
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center gap-2.5 px-4 py-1 bg-neutral-second border border-primary-second rounded-[10px] truncate ${open ? 'border-b-transparent rounded-b-none ' : ''}`}
                title={t('add_new_record')}
            >
                <span className={`text-[16px] font-medium ${open ? 'text-neutral-first/50' : 'text-neutral-first'} truncate`}>
                    {t('add_new_record')}
                </span>
                <Image
                    src="/images/common/down_arrow.png"
                    alt="open"
                    width={14}
                    height={8}
                    className={`h-auto transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 py-1 top-full w-full bg-neutral-second border border-primary-second border-t-0 rounded-b-[10px] overflow-hidden">
                    <Divider />
                    {mechanisms.length === 0 && (
                        <div className="px-4 py-3 text-[16px] text-neutral-first truncate" title={t('no_options_available')}>
                            {t('no_options_available')}
                        </div>
                    )}

                    {mechanisms.map((mech, index) => {
                        const showDivider = mechanisms.length > 2 && index < mechanisms.length - 1;
                        switch (mech.mechanism_type) {
                            case 'VC_IMPORT':
                                return (
                                    <div key={mech.mechanism_id}>
                                        <SectionHeading title="Add from VC" />
                                        {vcOptions.map(vc => (
                                            <DropdownItem
                                                flag={false}
                                                key={vc.vc_config_id}
                                                label={vc.vc_mnemonic}
                                                onClick={() => {
                                                    onSelectVC?.(vc);
                                                    setOpen(false);
                                                }}
                                            />
                                        ))}
                                        {showDivider && <Divider />}
                                    </div>
                                );

                            case 'FILE_IMPORT':
                                return (
                                    <div key={mech.mechanism_id}>
                                        <SectionHeading title="File Import" />
                                        {/* <DropdownItem flag={false} label="CSV" onClick={onImportCSV} />
                                        <DropdownItem flag={false} label="PDS" onClick={onImportPDS} /> */}
                                        {showDivider && <Divider />}
                                    </div>
                                );

                            case 'FORM_ENTRY':
                                return (
                                    <div key={mech.mechanism_id}>
                                        <DropdownItem
                                            flag={true}
                                            key={mech.mechanism_id}
                                            label="New Application"
                                            onClick={() => {
                                                console.log('Open form entry');
                                                setOpen(false);
                                            }}
                                        />
                                        {showDivider && <Divider />}
                                    </div>
                                );

                            default:
                                return null;
                        }
                    })}
                </div>
            )}
        </div>
    );
}

function DropdownItem({
    flag = false,
    label,
    onClick,
}: {
    flag: boolean;
    label: string;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-1 text-[16px] cursor-pointer hover:bg-secondary-first ${flag ? 'text-[16px] text-neutral-first font-medium' : 'text-neutral-first/50 font-normal'} truncate`}
            title={label}
        >
            {label}
        </div>
    );
}

function SectionHeading({ title }: { title: string }) {
    return (
        <div className="px-4 py-1 text-[16px] font-semibold text-neutral-first hover:bg-secondary-first truncate" title={title}>
            {title}
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-primary-second my-1" />;
}
