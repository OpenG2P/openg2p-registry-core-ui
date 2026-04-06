'use client';

import { useClickOutside } from '@/shared/hooks';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IntakeForm } from '../types/intake-form';

interface NewIntakeFormDropdownProps {
    forms?: IntakeForm[];
    onSelectForm?: (form: IntakeForm) => void;
}

export default function NewIntakeFormDropdown({
    forms = [],
    onSelectForm,
}: NewIntakeFormDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    useClickOutside(ref, () => setOpen(false), open);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-2 px-4 py-1 mt-2 rounded-[10px] bg-white ${open ? '' : 'border border-[#F77F57]'
                    }`}
            >
                <span className="text-[16px] font-medium text-[#1E1E1E]">
                    {t('new_intake')}
                </span>

                <Image
                    src="/images/common/down_arrow.png"
                    alt="open"
                    width={14}
                    height={8}
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-0 mt-1.5 w-60 rounded-[10px] bg-white border border-[#ED7C22] z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-1">
                        <span className="text-[16px] font-medium text-[#1E1E1E]">
                            {t('new_intake')}
                        </span>

                        <Image
                            src="/images/common/down_arrow.png"
                            alt="close"
                            width={14}
                            height={8}
                            className="rotate-180 cursor-pointer"
                            onClick={() => setOpen(false)}
                        />
                    </div>

                    {forms.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            {t('no_options_available')}
                        </div>
                    )}

                    {forms.map(form => (
                        <DropdownItem
                            key={form.tab_id}
                            label={form.intake_form_name}
                            onClick={() => {
                                onSelectForm?.(form);
                                setOpen(false);
                            }}
                        />
                    ))}
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
            className="px-4 py-2 text-[14px]  cursor-pointer text-black/50 hover:bg-[#F3F1E4]"
        >
            {label}
        </div>
    );
}