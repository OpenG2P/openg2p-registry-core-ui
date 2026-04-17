'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Register } from '../shared/types';

interface ViewRegisterFieldsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: Register;
}

export default function ViewRegisterFieldsModal({
    isOpen,
    onClose,
    data,
}: ViewRegisterFieldsModalProps) {
    const t = useTranslations();

    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 ">
            <div className="relative w-full max-w-200 max-h-[95vh] bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[10px] p-10 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-6">
                        {data.register_mnemonic} {t('details')}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('registry_name')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_mnemonic || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('register_subject')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_subject || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('description')}</div>
                            <div className="flex-1 text-[16px] text-black font-semibold leading-relaxed text-wrap wrap-break-word">
                                {data.register_description || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('register_purpose')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold uppercase">
                                {data.register_purpose || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('master_register')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.master_register_mnemonic || data.master_register_id || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('deduplication_enabled')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.dedup_is_enabled ? t('true') : t('false')}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('dedup_threshold_score')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.dedup_threshold_score ?? 0}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('functional_id_generation_required')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.functional_id_generation_required ? t('true') : t('false')}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('register_rank')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_rank ?? 0}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('program_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold truncate">
                                {data.program_id || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('has_image')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.has_image ? t('true') : t('false')}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('has_data')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.has_data ? t('true') : t('false')}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('register_icon')}</div>
                            <div className="flex-1">
                                {data.register_icon ? (
                                    <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                                        <Image
                                            src={data.register_icon.startsWith('data:') ? data.register_icon : `data:image/png;base64,${data.register_icon}`}
                                            alt={t('register_logo_alt')}
                                            width={120}
                                            height={120}
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <span className="text-gray-500 italic text-sm">{t('no_icon_uploaded')}</span>
                                )}
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
