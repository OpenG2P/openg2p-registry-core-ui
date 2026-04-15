'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data?: any;
}

export default function ViewOutgestionTemplateModal({
    isOpen,
    onClose,
    data,
}: Props) {
    const t = useTranslations();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-150 bg-white rounded-[10px] border-5 border-[#F2BA1A] p-10">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 opacity-50"
                >
                    <X size={30} />
                </button>

                <h2 className="text-[24px] text-[#ED7C22] font-medium mb-6">
                    {t('view_outgestion_template')}
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="text-[16px] font-medium">
                            {t('template_id')}
                        </label>
                        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px]">
                            {data?.template_id || '-'}
                        </div>
                    </div>

                    <div>
                        <label className="text-[16px] font-medium">
                            {t('register_mnemonic')}
                        </label>
                        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px]">
                            {data?.register_mnemonic || '-'}
                        </div>
                    </div>

                    <div>
                        <label className="text-[16px] font-medium">
                            {t('data_model_mnemonic')}
                        </label>
                        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px]">
                            {data?.data_model_mnemonic || '-'}
                        </div>
                    </div>

                    <div>
                        <label className="text-[16px] font-medium">
                            {t('template_file_id')}
                        </label>
                        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px]">
                            {data?.template_file_id || '-'}
                        </div>
                    </div>

                    <div className="flex justify-start pt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[#DDDDDD] text-[#00000080] rounded-[10px]"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}