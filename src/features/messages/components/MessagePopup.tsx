'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MessagePopupProps {
    onClose: () => void;
    rawJson: object | null;
    transformedJson: object | null;
    enrichedJson: object | null;
    loading?: boolean;
}

export default function MessagePopup({
    onClose,
    rawJson,
    transformedJson,
    enrichedJson,
    loading,
}: MessagePopupProps) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 'raw', label: 'Raw Message', data: rawJson },
        { id: 'enriched', label: 'Enriched Message', data: enrichedJson },
        { id: 'transformed', label: 'Transformed Message', data: transformedJson },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-[40px] w-200 h-150 p-10 border-10 border-[#F2BA1A] flex flex-col">
                <button
                    className="absolute top-10 right-10 opacity-50"
                    onClick={onClose}
                >
                    <Image src="/cr_close.png" alt="Close" width={30} height={30} />
                </button>

                <div className="pb-3">
                    <div className="flex gap-2 pr-10">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(index)}
                                className={`px-8 py-2 text-[18px] font-medium rounded-t-[20px] transition-all ${activeTab === index
                                    ? 'bg-[#F2BA1A]'
                                    : 'bg-[#DDDDDD]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-[#D9D9D980] px-6 py-3 overflow-y-auto overflow-x-auto message-json-scroll">
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <pre className="text-[14px] text-black whitespace-pre">
                            {JSON.stringify(tabs[activeTab]?.data, null, 2)}
                        </pre>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 bg-black text-[16px] text-white px-10 py-2 rounded-[20px] w-fit self-start"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
