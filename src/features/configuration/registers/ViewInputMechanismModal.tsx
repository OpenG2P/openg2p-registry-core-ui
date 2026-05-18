'use client';

import { useTranslations } from 'next-intl';
import type { InputMechanism } from '../shared/hooks/useAllInputMechanisms';
import { BaseModal, Field } from '../shared/components';

interface ViewInputMechanismModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: InputMechanism | null;
}

const MECHANISM_TYPE_LABELS: Record<string, string> = {
    INTAKE_FORM: 'mechanism_type_intake_form',
    IMPORT_FILE: 'mechanism_type_import_file',
    VERIFIABLE_CREDENTIAL: 'mechanism_type_verifiable_credential',
};

export default function ViewInputMechanismModal({
    isOpen,
    onClose,
    data,
}: ViewInputMechanismModalProps) {
    const t = useTranslations();

    if (!isOpen || !data) return null;

    const mechanismTypeLabel = data.mechanism_type
        ? t(MECHANISM_TYPE_LABELS[data.mechanism_type] ?? data.mechanism_type)
        : undefined;

    return (
        <BaseModal
            title={t('view_input_mechanism')}
            onClose={onClose}
            maxWidth="max-w-220"
            secondaryActionLabel={t('close')}
        >
            <div className="bg-secondary-second/50 px-8 pt-2 pb-4">
                <Field label={t('display_key')} value={data.display_key} />
                <Field label={t('mechanism_type')} value={mechanismTypeLabel} />
                <Field label={t('mechanism_id')} value={data.mechanism_id} />
                <Field label={t('register_id')} value={data.register_id} />
            </div>
        </BaseModal>
    );
}
