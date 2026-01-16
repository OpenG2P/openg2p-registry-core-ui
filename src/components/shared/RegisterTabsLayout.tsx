'use client';

import { ReactNode, useTransition } from "react";
import { BreadcrumbBar } from "@/components/shared";
import { TabsResponse } from "@/shared/types";
import { useTranslations } from "next-intl";

interface Props {
    breadcrumb: { label: string; href?: string }[];
    tabs?: TabsResponse | null;
    activeTab?: number;
    onTabChange?: (index: number) => void;
    children: ReactNode;
}

export default function RegisterTabsLayout({
    breadcrumb,
    tabs,
    activeTab,
    onTabChange,
    children,
}: Props) {
    const t = useTranslations()
    return (
        <div className="min-h-screen bg-[#F3F1E4]">
            <div className="px-7.5 pt-5">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <div className="px-7.5 py-6">
                {tabs && activeTab !== undefined && onTabChange && (
                    <div className="flex gap-2 px-10">
                        {tabs.tabs.map((tab, tabIndex) => {
                            return (
                            <button
                                key={tab.tab_id}
                                onClick={() => onTabChange(tabIndex)}
                                className={`px-8 py-2 text-black text-[18px] font-medium rounded-t-[20px] transition-all ${activeTab === tabIndex
                                    ? 'bg-[#F2BA1A]'
                                    : 'bg-[#DDDDDD]'
                                    }`}
                            >
                               {t(tab.tab_label) || tab.tab_label}
                            </button>
                            );
                        })}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
