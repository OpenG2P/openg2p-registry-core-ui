'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { BaseModal, Field } from '../shared/components';
import { Register } from '../shared/types';

interface ViewRegisterFieldsModalProps {
    onClose: () => void;
    data?: Register;
}

export default function ViewRegisterFieldsModal({
    onClose,
    data,
}: ViewRegisterFieldsModalProps) {
    const t = useTranslations();

    if (!data) return null;

    return (
        <BaseModal
            title={`${data.register_mnemonic} ${t('details')}`}
            onClose={onClose}
            maxWidth="max-w-200"
        >
            <div className="bg-[#D9D9D980] px-8 pt-2 pb-4">
                <Field label={t('registry_name')} value={data.register_mnemonic} />

                <Field label={t('register_subject')} value={data.register_subject} />

                <Field label={t('description')} value={data.register_description} />

                <Field label={t('register_purpose')} value={data.register_purpose?.toUpperCase()} />

                <Field label={t('master_register')} value={data.master_register_mnemonic || data.master_register_id} />

                <Field label={t('deduplication_enabled')} value={data.dedup_is_enabled ? t('true') : t('false')} />

                <Field label={t('dedup_threshold_score')} value={data.dedup_threshold_score ?? 0} />

                <Field
                    label={t('functional_id_generation_required')}
                    value={data.functional_id_generation_required ? t('true') : t('false')}
                />

                <Field label={t('register_rank')} value={data.register_rank ?? 0} />

                <Field label={t('program_id')} value={data.program_id} />

                <Field label={t('has_image')} value={data.has_image ? t('true') : t('false')} />

                <Field label={t('has_data')} value={data.has_data ? t('true') : t('false')} />

                <div className="grid grid-cols-[1.2fr_2fr] gap-4 py-2">
                    <span className="text-black/50 text-[16px] font-medium">
                        {t('register_icon')}
                    </span>

                    <div>
                        {data.register_icon ? (
                            <div className="w-20 h-20 bg-white rounded-[10px] flex items-center justify-center p-2">
                                <Image
                                    src={data.register_icon.startsWith('data:') ? data.register_icon : `data:image/png;base64,${data.register_icon}`}
                                    alt={t('register_logo_alt')}
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <span className="text-black text-[16px] font-normal">
                                {t('no_icon_uploaded')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}