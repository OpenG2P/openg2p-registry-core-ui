"use client";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';

import { ProfileDropdown, NotificationDropdown, ConfigurationButton } from '@/components/layout';
import { LanguageSwitcher } from '@/components/layout';

export default function Header() {
    const t = useTranslations();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 fixed top-0 left-0 right-0 z-20 h-[70px]">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <Image
                    src="/openg2p_logo.png"
                    alt="Openg2p Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 sm:w-10 sm:h-10"
                />
                <span className="text-[16px] sm:text-[18px] md:text-[20px] text-black font-medium">
                    {t('registryGen2')}
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
                <ConfigurationButton />
                <LanguageSwitcher />
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
                <div className="md:hidden absolute top-[70px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30">
                    <div className="flex flex-col p-4 gap-4">
                        <ConfigurationButton />
                        <LanguageSwitcher />
                        <NotificationDropdown />
                        <ProfileDropdown />
                    </div>
                </div>
            )}
        </header>
    );
}
