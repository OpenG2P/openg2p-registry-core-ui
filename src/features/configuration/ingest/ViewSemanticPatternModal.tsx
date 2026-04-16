'use client';

import { useTranslations } from 'next-intl';
import { IncomingSemanticPattern } from '@/features/configuration/shared/hooks/useAllSemanticPatterns';
import { BaseModal, Field } from '../shared/components';


interface ViewSemanticPatternModalProps {
    onClose: () => void;
    data?: IncomingSemanticPattern;
}

export default function ViewSemanticPatternModal({
    onClose,
    data,
}: ViewSemanticPatternModalProps) {
    const t = useTranslations();

    return (
        <BaseModal
            title={t("semantic_pattern_details")}
            onClose={onClose}
            maxWidth='max-w-220'
        >
            <div className="grid grid-cols-2 gap-6">
                <Field label={t('semantic_pattern_id')} value={data?.semantic_pattern_id} />
                <Field label={t('data_model')} value={data?.data_model_mnemonic || '-'} />

                <Field label={t('data_model_id')} value={data?.data_model_id} />
                <Field label={t('register')} value={data?.register_mnemonic || '-'} />

                <Field label={t('register_id')} value={data?.register_id} />
                <Field label={t('section')} value={data?.section_mnemonic || '-'} />

                <Field label={t('section_id')} value={data?.section_id || '-'} />
                <Field label={t('pattern_for_register')} value={data?.pattern_for_register || '-'} />

                <Field label={t('pattern_for_section')} value={data?.pattern_for_section || '-'} />
                <Field label={t('business_payload')} value={data?.key_path_for_business_payload || '-'} />

                <Field label={t('enricher_class')} value={data?.raw_payload_enricher_class || '-'} />
            </div>
        </BaseModal>
    );
}
