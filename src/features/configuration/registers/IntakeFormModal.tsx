"use client";
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from 'react-toastify';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function IntakeFormModal({ isOpen, onClose, onSuccess }: Props) {
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
            toast.warn('Intake Form Name is required');
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
            toast.success('Intake Form created successfully');
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
            toast.error('Failed to create intake form');
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
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-150 bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[10px] overflow-y-hidden p-10">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">
                        Intake Form Settings
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">
                                Intake Form Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. household_intake"
                                value={formData.intake_form_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, intake_form_name: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Intake Form Description
                            </label>
                            <textarea
                                placeholder="Enter description"
                                value={formData.intake_form_description}
                                onChange={(e) =>
                                    setFormData({ ...formData, intake_form_description: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                No. of Verifications Required
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 0"
                                value={formData.no_of_verifications_required}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        no_of_verifications_required: Number(e.target.value)
                                    })
                                }
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] text-gray-600 placeholder:text-gray-400"
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
                                    className="h-4 w-4"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Auto Approve Intake Form
                                </span>
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
                                    className="h-4 w-4"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Is Active
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-[10px]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-black text-white rounded-[10px]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}