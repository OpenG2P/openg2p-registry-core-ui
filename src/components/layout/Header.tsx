"use client";
import Image from "next/image";
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ProfileDropdown, NotificationDropdown, ConfigurationButton } from '@/components/layout';
import { useRuntimeConfig } from "@/context/RuntimeConfigContext";

export default function Header() {
    const t = useTranslations();
    const locale = useLocale();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { config } = useRuntimeConfig();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`w-full bg-white flex items-center justify-between px-3 py-3 fixed top-0 left-0 right-0 z-20 h-17.5 ${isScrolled ? "shadow-[0px_4px_10px_0px_#00000026]" : ""}`}>
            <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-3">
                <Image
                    src={config?.registryLogo || "/images/common/openg2p_logo.png"}
                    alt="Registry Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    unoptimized
                />
                <div className="flex items-center gap-3">
                    <span className="text-[16px] sm:text-[18px] md:text-[20px] text-black font-medium">
                        {config?.registryName || t('registryGen2')}
                    </span>

                    {/* <span className="h-8 w-0.5 bg-[#D9D9D9]" />

                    <div className="flex flex-col leading-tight">
                        <span className="text-[14px] text-black/50">
                            powered by
                        </span>
                        <span className="text-[16px] font-medium text-black">
                            OpenG2P
                        </span>
                    </div> */}
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                <ConfigurationButton />
                <NotificationDropdown />
                <ProfileDropdown />
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                aria-label="Toggle mobile menu"
            >
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-17.5 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30">
                    <div className="flex flex-col p-4 gap-4">
                        <ConfigurationButton />
                        <NotificationDropdown />
                        <ProfileDropdown />
                    </div>
                </div>
            )}
        </header>
    );
}
