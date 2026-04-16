'use client';

import { useTranslations } from 'next-intl';
import { IncomingKeyPath } from '@/features/configuration/shared/hooks/useAllIncomingKeyPaths';
import { BaseModal, Field } from '../shared/components';

interface ViewKeyPathModalProps {
    onClose: () => void;
    data?: IncomingKeyPath;
}

export default function ViewKeyPathModal({
    onClose,
    data,
}: ViewKeyPathModalProps) {
    const t = useTranslations();

    return (
        <BaseModal
            title={`${t('ingest_key_paths')} ${t('details')}`}
            onClose={onClose}
            maxWidth='max-w-200'
        >
            <div className="grid grid-cols-2 gap-6">
                <Field label={t('key_path_id')} value={data?.key_path_id} />
                <Field label={t('data_model')} value={data?.data_model_mnemonic || '-'} />

                <Field label={t('data_model_id')} value={data?.data_model_id} />
                <Field label={t('message_id')} value={data?.key_path_for_message_id || '-'} />

                <Field label={t('sender')} value={data?.key_path_for_sender || '-'} />
                <Field label={t('signature')} value={data?.key_path_for_signature || '-'} />

                <Field label={t('signature_payload')} value={data?.key_path_for_signature_payload || '-'} />
                <Field label={t('is_list')} value={data?.is_list ? t('true') : t('false')} />
            </div>

            {data?.is_list && (
                <Field
                    label={t('list_elements')}
                    value={data.key_path_for_list_elements || '-'}
                />
            )}
        </BaseModal>
    );
}
