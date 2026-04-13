'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IncomingSemanticPattern } from '@/features/configuration/shared/hooks/useSemanticPatterns';

interface ViewSemanticPatternModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: IncomingSemanticPattern;
}

export default function ViewSemanticPatternModal({
    isOpen,
    onClose,
    data,
}: ViewSemanticPatternModalProps) {
    const t = useTranslations();

    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-[95vh] bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[10px] p-10 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-6">
                        {t('semantic_pattern_id')}: {data.semantic_pattern_id}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('data_model_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.data_model_id}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('register_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_id}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('section_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.section_id || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('pattern_for_register')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.pattern_for_register || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('pattern_for_section')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.pattern_for_section || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('business_payload')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.key_path_for_business_payload || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('enricher_class')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.raw_payload_enricher_class || '-'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-start">
                        <button
                            onClick={onClose}
                            className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-[10px] hover:bg-gray-400 transition-colors font-semibold"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
