'use client';

import { ReactNode } from "react";
import { BreadcrumbBar } from "@/components/shared";

interface Tab {
    label: string;
}
interface TabConfig {
  'tab-id': string;
  'tab-label': string;
  order: number;
}

interface TabsApiResponse {
  tabs: TabConfig[];
}
interface Props {
    breadcrumb: { label: string; href?: string }[];
    tabsData: TabsApiResponse | null;
    activeTab: number;
    onTabChange: (index: number) => void;
    children: ReactNode;
}

export default function RegisterPageLayout({
    breadcrumb,
    tabsData,
    activeTab,
    onTabChange,
    children,
}: Props) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-10 py-4 bg-white border-b border-gray-300">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <div className="px-10 py-6">
                <div className="flex gap-2 mb-6 border-b-4 border-gray-300">
                    {tabsData?.tabs?.map((tab, tabIndex) => (
                        <button
                            key={tab['tab-id']}
                            onClick={() => onTabChange(tabIndex)}
                            className={`px-12 py-3 font-bold transition-all rounded-t-lg ${activeTab === tabIndex
                                    ? 'bg-black text-white'
                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                }`}
                        >
                            {tab['tab-label']}
                        </button>
                    ))}
                </div>

                {children}
            </div>
        </div>
    );
}
