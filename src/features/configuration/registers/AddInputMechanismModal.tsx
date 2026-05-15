'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { BaseModal, CustomDropdown, InputField } from '../shared/components';

const MECHANISM_TYPES = [
    { value: 'INTAKE_FORM', labelKey: 'mechanism_type_intake_form' },
    { value: 'IMPORT_FILE', labelKey: 'mechanism_type_import_file' },
    { value: 'VERIFIABLE_CREDENTIAL', labelKey: 'mechanism_type_verifiable_credential' },
] as const;

interface AddInputMechanismModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddInputMechanismModal({
    isOpen,
    onClose,
    onSuccess,
}: AddInputMechanismModalProps) {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const { execute: createMechanism } = useFetch();

    const [displayKey, setDisplayKey] = useState('');
    const [mechanismType, setMechanismType] = useState('');

    const mechanismTypeOptions = MECHANISM_TYPES.map((type) => ({
        label: t(type.labelKey),
        value: type.value,
    }));

    const resetForm = () => {
        setDisplayKey('');
        setMechanismType('');
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!displayKey.trim()) {
            toast.warn(t('display_key_required'));
            return;
        }
        if (!mechanismType) {
            toast.warn(t('mechanism_type_required'));
            return;
        }

        const result = await createMechanism('/api/configuration/ingest/create-input-mechanism', {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                mechanism_type: mechanismType,
                display_key: displayKey.trim(),
            }),
        });

        if (result?.mechanism_id) {
            toast.success(t('toast_input_mechanism_created'));
            resetForm();
            onSuccess?.();
            onClose();
        } else {
            toast.error(t('toast_input_mechanism_create_failed'));
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            title={t('add_input_mechanism')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
        >
            <div className="space-y-4">
                <InputField
                    label={t('display_key')}
                    value={displayKey}
                    onChange={setDisplayKey}
                    placeholder={t('enter_display_key')}
                />
                <CustomDropdown
                    label={t('mechanism_type')}
                    options={mechanismTypeOptions}
                    value={mechanismType}
                    onChange={setMechanismType}
                    placeholder={t('select_mechanism_type')}
                />
            </div>
        </BaseModal>
    );
}
