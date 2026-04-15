'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data?: any;
}

export default function ViewOutgestionTopicModal({
    isOpen,
    onClose,
    data,
}: Props) {
    const t = useTranslations();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 bg-white rounded-[10px] border-5 border-[#F2BA1A] p-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 opacity-50"
                >
                    <X size={30} />
                </button>

                <h2 className="text-[24px] text-[#ED7C22] font-medium mb-6">
                    {t('view_outgestion_topic')}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Field label={t('topic_id')} value={data?.topic_id} />
                        <Field label={t('register_id')} value={data?.register_id} />
                        <Field label={t('register_mnemonic')} value={data?.register_mnemonic} />
                        <Field label={t('data_model_id')} value={data?.data_model_id} />
                        <Field label={t('data_model_mnemonic')} value={data?.data_model_mnemonic} />
                        <Field
                            label={t('websub_register_error')}
                            value={data?.websub_register_latest_error_message}
                        />
                    </div>

                    <div className="space-y-4">
                        <Field label={t('websub_topic')} value={data?.websub_topic} />
                        <Field label={t('description')} value={data?.description} />
                        <Field label={t('is_active')} value={data?.is_active ?  t('true') :  t('false')} />
                        <Field label={t('websub_register_status')} value={data?.websub_register_status} />
                        <Field
                            label={t('websub_register_datetime')}
                            value={data?.websub_register_datetime}
                        />
                        <Field
                            label={t('websub_register_attempts')}
                            value={data?.websub_register_number_of_attempts}
                        />
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
    );
}

const Field = ({ label, value }: { label: string; value: any }) => (
    <div>
        <label className="text-[16px] font-medium">
            {label}
        </label>
        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px] truncate" title={value}>
            {value || '-'}
        </div>
    </div>
);