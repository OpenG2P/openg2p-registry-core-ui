'use client';

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFetch } from "@/shared/hooks";
import { toast } from "react-toastify";
import { Tab } from "../shared/types";

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
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-150 bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white p-10 relative rounded-[10px] overflow-y-auto">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">
                        {t('edit_intake_form')}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                {t('intake_form_name')}
                            </label>

                            <input
                                type="text"
                                value={formData.intake_form_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        intake_form_name: e.target.value
                                    })
                                }
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                {t('description')}
                            </label>

                            <textarea
                                value={formData.intake_form_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        intake_form_description: e.target.value
                                    })
                                }
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                {t('no_of_verifications_required_label')}
                            </label>

                            <input
                                type="number"
                                value={formData.no_of_verifications_required}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        no_of_verifications_required: Number(e.target.value)
                                    })
                                }
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57]"
                            />
                        </div>

                        <div className="flex w-full gap-4 pt-2">
                            <label className="flex flex-1 items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.intake_form_auto_approve}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            intake_form_auto_approve: e.target.checked
                                        })
                                    }
                                />
                                <span>{t('auto_approve')}</span>
                            </label>

                            <label className="flex flex-1 items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_active: e.target.checked
                                        })
                                    }
                                />
                                <span>{t('is_active')}</span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-gray-300 rounded-[10px]"
                            >
                                {t('cancel')}
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-black text-white rounded-[10px]"
                            >
                                {t('update')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}