'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import React, { useRef, useState, useTransition } from 'react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

const LANGUAGE_CONFIG: Record<string, { label: string; flag: string }> = {
    en: { label: 'English', flag: '/images/common/flags/en_flag.png' },
    fr: { label: 'French', flag: '/images/common/flags/fr_flag.png' },
    es: { label: 'Spanish', flag: '/images/common/flags/es_flag.png' },
};

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setOpen(false), open);

    const handleLanguageChange = (newLocale: string) => {
        setOpen(false);
        startTransition(() => {
            router.replace({ pathname }, { locale: newLocale });
        });
    };

    const currentLanguage = LANGUAGE_CONFIG[locale] || LANGUAGE_CONFIG.en;

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                disabled={isPending}
                className="flex items-center justify-between rounded-[10px] gap-2 px-4 py-2 min-w-35 text-[16px] font-medium cursor-pointer transition-all focus:outline-none"
            >
                <div className="flex items-center gap-2">
                    <div className="w-6 h-4 relative rounded-sm overflow-hidden shrink-0 border">
                        <Image
                            src={currentLanguage.flag}
                            alt={currentLanguage.label}
                            fill
                            sizes="28px"
                            className="object-cover"
                        />
                    </div>

                    <span className="text-neutral-first text-[14px] font-normal leading-normal">
                        {currentLanguage.label}
                    </span>
                </div>

                <Image
                    src="/images/common/down_arrow.png"
                    alt="toggle"
                    width={14}
                    height={14}
                    className={`h-auto transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className="absolute top-full left-0 mt-2 min-w-35 ring-1 ring-black/10 rounded-[10px] bg-neutral-second overflow-hidden z-50"
                >
                    {routing.locales.map((loc, index) => {
                        const lang = LANGUAGE_CONFIG[loc] || { label: loc, flag: LANGUAGE_CONFIG.en.flag };
                        return (
                            <button
                                key={loc}
                                onClick={() => handleLanguageChange(loc)}
                                className="flex items-center justify-between gap-2 px-4 py-2 min-w-35 text-[16px] font-medium cursor-pointer transition-all focus:outline-none"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-4 relative rounded-sm overflow-hidden shrink-0 border">
                                        <Image
                                            src={lang.flag}
                                            alt={lang.label}
                                            width={27}
                                            height={18}
                                            className="object-cover h-auto"
                                        />
                                    </div>
                                    <span className="text-neutral-first text-[14px] font-normal leading-normal">{lang.label}</span>
                                </div>

                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

