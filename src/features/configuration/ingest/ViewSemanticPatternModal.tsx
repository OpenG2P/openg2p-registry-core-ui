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
            title={t("view_semantic_pattern")}
            onClose={onClose}
            maxWidth='max-w-3xl'
            secondaryActionLabel={t('close')}
        >
            <div className="bg-[#F5F5F5] rounded-[10px] p-8 -mx-2">
                <Field label={t('data_model')} value={data?.data_model_mnemonic} />
                <Field label={t('register')} value={data?.register_mnemonic} />
                <Field label={t('section')} value={data?.section_mnemonic} />
                <Field label={t('pattern_for_register')} value={data?.pattern_for_register} />
                <Field label={t('pattern_for_section')} value={data?.pattern_for_section} />
                <Field label={t('key_path_for_business_payload')} value={data?.key_path_for_business_payload} />
                <Field label={t('raw_payload_enricher_class')} value={data?.raw_payload_enricher_class} />
            </div>
        </BaseModal>
    );
}
