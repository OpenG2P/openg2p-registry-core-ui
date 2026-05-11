"use client";
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";
import { BaseModal, InputField, TextAreaField } from '../shared/components';
import CheckboxField from '../shared/components/CheckboxField';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function IntakeFormModal({ isOpen, onClose, onSuccess }: Props) {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const { execute: createIntakeForm, loading } = useFetch();
    const [formData, setFormData] = useState({
        no_of_verifications_required: 0,
        intake_form_name: "",
        intake_form_description: "",
        intake_form_auto_approve: false,
        is_active: true,
    });

    const handleSubmit = async () => {
        if (!formData.intake_form_name) {
            toast.warn(t('intake_form_name_required') || 'Intake Form Name is required');
            return;
        }

        const result = await createIntakeForm('/api/configuration/registers/tabs/create', {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                used_for_new_intake_form: true,
                intake_form_name: formData.intake_form_name,
                intake_form_description: formData.intake_form_description,
                intake_form_auto_approve: formData.intake_form_auto_approve,
                no_of_verifications_required: formData.no_of_verifications_required,
                is_active: formData.is_active
            })
        });

        if (result?.tab_id) {
            toast.success(t('toast_intake_form_created'));
            setFormData({
                intake_form_name: "",
                intake_form_description: "",
                intake_form_auto_approve: false,
                no_of_verifications_required: 0,
                is_active: true
            });
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error(t('toast_intake_form_create_failed'));
        }
    };

    const handleCancel = () => {
        setFormData({
            no_of_verifications_required: 0,
            intake_form_name: "",
            intake_form_description: "",
            intake_form_auto_approve: false,
            is_active: true
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            title={t('add_intake_form')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
        >
            <InputField
                label={t('intake_form_name')}
                placeholder={t('enter_intake_form_name') || "Enter Intake Form Name"}
                value={formData.intake_form_name}
                onChange={(value) =>
                    setFormData(prev => ({ ...prev, intake_form_name: value }))
                }
            />
            <TextAreaField
                label={t('intake_form_description')}
                placeholder={t('enter_description') || "Enter description"}
                value={formData.intake_form_description}
                onChange={(value) =>
                    setFormData(prev => ({ ...prev, intake_form_description: value }))
                }
            />
            <InputField
                label={t('no_of_verifications_required_label')}
                type="number"
                placeholder="0"
                value={formData.no_of_verifications_required}
                onChange={(value) =>
                    setFormData(prev => ({
                        ...prev,
                        no_of_verifications_required: Number(value) || 0
                    }))
                }
            />
            <div className="grid grid-cols-2 gap-4 pt-2">
                <CheckboxField
                    label={t('auto_approve')}
                    checked={formData.intake_form_auto_approve}
                    onChange={(value) =>
                        setFormData(prev => ({
                            ...prev,
                            intake_form_auto_approve: value
                        }))
                    }
                />
                <CheckboxField
                    label={t('active')}
                    checked={formData.is_active}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, is_active: value }))
                    }
                />
            </div>
        </BaseModal>
    );
}