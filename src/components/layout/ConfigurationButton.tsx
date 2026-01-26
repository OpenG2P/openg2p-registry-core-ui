"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export default function ConfigurationButton() {
    const router = useRouter();
    const t = useTranslations();

    const goToConfig = () => {
        router.push("/configuration/registry");
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
                {t('configuration')}
            </span>
        </button>
    );
}
