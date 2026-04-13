'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IncomingKeyPath } from '@/features/configuration/shared/hooks/useAllIncomingKeyPaths';

interface ViewKeyPathModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: IncomingKeyPath;
}

export default function ViewKeyPathModal({
    isOpen,
    onClose,
    data,
}: ViewKeyPathModalProps) {
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
                        {t('ingest_key_paths')} {t('details')}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('key_path_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.key_path_id}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('data_model')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.data_model_mnemonic || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('data_model_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.data_model_id}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('message_id')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.key_path_for_message_id || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('sender')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.key_path_for_sender || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('signature')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.key_path_for_signature || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('signature_payload')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.key_path_for_signature_payload || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('is_list')}</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.is_list ? t('true') : t('false')}
                            </div>
                        </div>

                        {data.is_list && (
                            <div className="flex items-start">
                                <div className="w-55 text-[16px] text-gray-400 font-medium shrink-0">{t('list_elements')}</div>
                                <div className="flex-1 text-[16px] text-black font-bold">
                                    {data.key_path_for_list_elements || '-'}
                                </div>
                            </div>
                        )}
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
