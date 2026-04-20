'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFetch } from "@/shared/hooks";
import { toast } from "react-toastify";
import { Tab } from "../shared/types";
import { BaseModal, CheckboxField, InputField, TextAreaField } from "../shared/components";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: Tab;
    registerId: string;
}

export default function EditIntakeFormModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
    registerId
}: Props) {
    const t = useTranslations();
    const { execute: updateIntakeForm, loading } = useFetch();

    const [formData, setFormData] = useState({
        no_of_verifications_required: 0,
        intake_form_name: "",
        intake_form_description: "",
        intake_form_auto_approve: false,
        is_active: true
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                intake_form_name: initialData.intake_form_name || "",
                intake_form_description: initialData.intake_form_description || "",
                intake_form_auto_approve: initialData.intake_form_auto_approve || false,
                no_of_verifications_required: initialData.no_of_verifications_required || 0,
                is_active: initialData.is_active ?? true
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {

        if (!formData.intake_form_name) {
            toast.warn("Intake Form Name is required");
            return;
        }

        const result = await updateIntakeForm(
            "/api/configuration/registers/tabs/edit",
            {
                method: "POST",
                body: JSON.stringify({
                    tab_id: initialData?.tab_id,
                    register_id: registerId,
                    used_for_new_intake_form: true,
                    intake_form_name: formData.intake_form_name,
                    intake_form_description: formData.intake_form_description,
                    intake_form_auto_approve: formData.intake_form_auto_approve,
                    no_of_verifications_required: formData.no_of_verifications_required,
                    is_active: formData.is_active
                })
            }
        );

        if (result) {
            toast.success("Intake form updated successfully");
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error("Failed to update intake form");
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            title={t('edit_intake_form')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
            maxWidth="max-w-200"
        >
            <InputField
                label={t('intake_form_name')}
                value={formData.intake_form_name}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        intake_form_name: value,
                    }))
                }
            />

            <TextAreaField
                label={t('intake_form_description')}
                value={formData.intake_form_description}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        intake_form_description: value,
                    }))
                }
                rows={2}
            />

            <InputField
                label={t('no_of_verifications_required_label')}
                value={String(formData.no_of_verifications_required)}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        no_of_verifications_required: Number(value),
                    }))
                }
                type="number"
                min={0}
            />

            <div className="grid grid-cols-2 gap-6">
                <CheckboxField
                    label={t('auto_approve')}
                    checked={formData.intake_form_auto_approve}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            intake_form_auto_approve: value,
                        }))
                    }
                />

                <CheckboxField
                    label={t('active')}
                    checked={formData.is_active}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_active: value,
                        }))
                    }
                />
            </div>
        </BaseModal>
    );
}