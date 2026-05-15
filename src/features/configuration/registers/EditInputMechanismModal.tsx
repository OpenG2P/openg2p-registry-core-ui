'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import type { InputMechanism } from '../shared/hooks/useAllInputMechanisms';
import { BaseModal, CustomDropdown, InputField } from '../shared/components';

const MECHANISM_TYPES = [
    { value: 'INTAKE_FORM', labelKey: 'mechanism_type_intake_form' },
    { value: 'IMPORT_FILE', labelKey: 'mechanism_type_import_file' },
    { value: 'VERIFIABLE_CREDENTIAL', labelKey: 'mechanism_type_verifiable_credential' },
] as const;

interface EditInputMechanismModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: InputMechanism | null;
}

export default function EditInputMechanismModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}: EditInputMechanismModalProps) {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const { execute: updateMechanism } = useFetch();

    const [displayKey, setDisplayKey] = useState('');
    const [mechanismType, setMechanismType] = useState('');

    const mechanismTypeOptions = MECHANISM_TYPES.map((type) => ({
        label: t(type.labelKey),
        value: type.value,
    }));

    useEffect(() => {
        if (initialData) {
            setDisplayKey(initialData.display_key ?? '');
            setMechanismType(initialData.mechanism_type ?? '');
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (!initialData?.mechanism_id) return;
        if (!displayKey.trim()) {
            toast.warn(t('display_key_required'));
            return;
        }
        if (!mechanismType) {
            toast.warn(t('mechanism_type_required'));
            return;
        }

        const result = await updateMechanism('/api/configuration/registers/input-mechanism/update-input-mechanism', {
            method: 'POST',
            body: JSON.stringify({
                mechanism_id: initialData.mechanism_id,
                register_id: registerId,
                mechanism_type: mechanismType,
                display_key: displayKey.trim(),
            }),
        });

        if (result?.mechanism_id) {
            toast.success(t('toast_input_mechanism_updated'));
            onSuccess?.();
            onClose();
        } else {
            toast.error(t('toast_input_mechanism_update_failed'));
        }
    };

    if (!isOpen || !initialData) return null;

    return (
        <BaseModal
            title={t('edit_input_mechanism')}
            onClose={onClose}
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
