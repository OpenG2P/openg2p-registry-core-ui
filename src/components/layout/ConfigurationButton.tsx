"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ConfigurationButton() {
    const router = useRouter();

    const goToConfig = () => {
        router.push("/config");
    };

    return (
        <button
            onClick={goToConfig}
            className="flex items-center gap-2 hover:opacity-80"
        >
            <Image
                src="/config_icon.png"
                alt="Config Icon"
                width={24}
                height={24}
            />
            <span className="text-[16px] text-black">
                Configuration
            </span>
        </button>
    );
}
