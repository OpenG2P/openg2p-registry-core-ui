"use client";
import Image from "next/image";

import { ProfileDropdown, NotificationDropdown, ConfigurationButton } from '@/components/layout';

export default function Header() {
    return (
        <header className="w-full bg-white flex items-center justify-between px-3 py-3 fixed top-0 left-0 right-0 z-20 h-[70px] border-b border-gray-300 shadow-[0px_4px_10px_0px_#00000026]">
            <div className="flex items-center gap-3">
                <Image
                    src="/openg2p_logo.png"
                    alt="Openg2p Logo"
                    width={40}
                    height={40}
                />
                <span className="text-[20px] text-black">
                    Registry Gen2
                </span>
            </div>

            <div className="flex items-center gap-6">
                <ConfigurationButton />
                <NotificationDropdown />
                <ProfileDropdown />
            </div>
        </header>
    );
}
