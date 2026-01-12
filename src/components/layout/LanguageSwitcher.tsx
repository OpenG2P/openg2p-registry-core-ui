'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import React, { useState, useRef, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

const flagMap: Record<string, string> = {
    en: "/flags/en_flag.png",
    de: "/flags/de_flag.png",
    cs: "/flags/cs_flag.png"
};

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();
    const t = useTranslations();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setOpen(false), open);

    const handleLanguageChange = (newLocale: string) => {
        setOpen(false);
        startTransition(() => {
            router.replace({ pathname }, { locale: newLocale });
        });
    };

    const currentFlag = flagMap[locale] || "/flags/uk_flag.png";

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-transparent text-sm font-medium focus:outline-none"
                disabled={isPending}
            >
                <div className="w-6 h-4 relative border shadow-sm overflow-hidden flex-shrink-0">
                    <Image
                        src={currentFlag}
                        alt={locale}
                        fill
                        sizes="24px"
                        className="object-cover"
                    />
                </div>
                <span className="text-black text-[16px]">
                    {t(locale)}
                </span>
                <div className={`w-3 h-2 relative transition-transform ${open ? 'rotate-180' : ''}`}>
                    <Image
                        src="/down_arrow.png"
                        alt="toggle"
                        fill
                        sizes="12px"
                        className="object-contain"
                    />
                </div>
            </button>

            {open && (
                <div className="absolute top-10 right-0 w-32 bg-white border  rounded border-gray-200 shadow-lg py-1 flex flex-col">
                    {routing.locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => handleLanguageChange(loc)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50
                                ${locale === loc ? 'font-bold bg-gray-50' : 'font-normal text-gray-700'}
                            `}
                        >
                            <div className="w-5 h-3.5 relative border rounded-sm overflow-hidden flex-shrink-0">
                                <Image
                                    src={flagMap[loc] || "/flags/uk_flag.png"}
                                    alt={loc}
                                    fill
                                    sizes="20px"
                                    className="object-cover"
                                />
                            </div>
                            <span>{t(loc)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
