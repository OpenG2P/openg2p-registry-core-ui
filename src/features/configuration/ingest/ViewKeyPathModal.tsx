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
            title={`${t('view_ingest_key_path')}`}
            onClose={onClose}
            maxWidth='max-w-3xl'
            secondaryActionLabel={t('close')}
        >
            <div className="bg-[#F5F5F5] rounded-[10px] p-8 -mx-2">
                <Field label={t('data_model')} value={data?.data_model_mnemonic} />
                <Field label={t('key_path_for_message_id')} value={data?.key_path_for_message_id} />
                <Field label={t('key_path_for_sender')} value={data?.key_path_for_sender} />
                <Field label={t('key_path_for_signature')} value={data?.key_path_for_signature} />
                <Field label={t('key_path_for_signature_payload')} value={data?.key_path_for_signature_payload} />
                <Field label={t('is_list')} value={data?.is_list ? t('true') : t('false')} />
                {data?.is_list && (
                    <Field label={t('key_path_for_list_elements')} value={data.key_path_for_list_elements} />
                )}
            </div>
        </BaseModal>
    );
}
