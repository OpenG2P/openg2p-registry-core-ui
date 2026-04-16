'use client';

import { useTranslations } from 'next-intl';
import { BaseModal, Field } from '../shared/components';


interface Props {
    onClose: () => void;
    data?: any;
}

export default function ViewOutgestionTopicModal({
    onClose,
    data,
}: Props) {
    const t = useTranslations();

    return (
        <BaseModal
            title={t('view_outgestion_topic')}
            onClose={onClose}
            maxWidth="max-w-200"
        >
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
                    <Field
                        label={t('is_active')}
                        value={data?.is_active ? t('true') : t('false')}
                    />
                    <Field
                        label={t('websub_register_status')}
                        value={data?.websub_register_status}
                    />
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
        </BaseModal>
    );
}