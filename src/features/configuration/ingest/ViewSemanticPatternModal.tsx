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

                <div className="pt-6">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('pattern_for_register')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                        {data?.pattern_for_register || '-'}
                    </div>
                </div>

                <div className="pt-4">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('pattern_for_section')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100">
                        {data?.pattern_for_section || '-'}
                    </div>
                </div>

                <div className="pt-4">
                    <span className="text-[#808080] text-[16px] font-medium block mb-2">{t('key_path_for_business_payload')}</span>
                    <div className="text-black text-[16px] font-bold bg-white p-4 rounded-lg border border-gray-100 overflow-x-auto">
                        {data?.key_path_for_business_payload || '-'}
                    </div>
                </div>

                <Field label={t('raw_payload_enricher_class')} value={data?.raw_payload_enricher_class} />
            </div>
        </BaseModal>
    );
}
