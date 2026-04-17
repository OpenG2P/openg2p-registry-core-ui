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

                <div className="pt-6">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('key_path_for_message_id')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                        {data?.key_path_for_message_id || '-'}
                    </div>
                </div>

                <div className="pt-4">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('key_path_for_sender')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                        {data?.key_path_for_sender || '-'}
                    </div>
                </div>

                <div className="pt-4">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('key_path_for_signature')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                        {data?.key_path_for_signature || '-'}
                    </div>
                </div>

                <div className="pt-4">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('key_path_for_signature_payload')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                        {data?.key_path_for_signature_payload || '-'}
                    </div>
                </div>

                <Field label={t('is_list')} value={data?.is_list ? t('true') : t('false')} />

                {data?.is_list && (
                    <div className="pt-4">
                        <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('key_path_for_list_elements')}</span>
                        <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                            {data.key_path_for_list_elements || '-'}
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    );
}
