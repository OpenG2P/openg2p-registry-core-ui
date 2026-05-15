'use client';

import { useTranslations } from 'next-intl';
import type { ImportFileConfiguration } from '@/features/configuration/shared/hooks/useAllImportFileConfigurations';
import { BaseModal, Field } from '../shared/components';

interface ViewImportFileConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: ImportFileConfiguration | null;
}

export default function ViewImportFileConfigModal({
    isOpen,
    onClose,
    data,
}: ViewImportFileConfigModalProps) {
    const t = useTranslations();

    if (!isOpen || !data) return null;

    return (
        <BaseModal
            title={t('view_import_file_config')}
            onClose={onClose}
            maxWidth="max-w-220"
            secondaryActionLabel={t('close')}
        >
            <div className="bg-secondary-second/50 px-8 pt-2 pb-4">
                <Field label={t('template_mnemonic')} value={data.import_file_template_mnemonic} />
                <Field
                    label={t('template_description')}
                    value={data.import_file_template_description}
                    layout="column"
                />
                <Field label={t('form_id')} value={data.form_id} />
                <Field label={t('data_model_id')} value={data.data_model_id} />
                <Field label={t('import_file_config_id')} value={data.import_file_configuration_id} />
            </div>
        </BaseModal>
    );
}
