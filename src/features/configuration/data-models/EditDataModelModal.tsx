'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';

interface EditDataModelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    data?: any;
}

export default function EditDataModelModal({
    isOpen,
    onClose,
    onSuccess,
    data,
}: EditDataModelModalProps) {
    const t = useTranslations();
    const { execute: updateDataModel } = useFetch();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        data_model_mnemonic: '',
        pattern_for_data_model: '',
        response_template_file_id: '',
        is_active: true,
    });

    useEffect(() => {
        if (data) {
            setFormData({
                data_model_mnemonic: data.data_model_mnemonic || '',
                pattern_for_data_model: data.pattern_for_data_model || '',
                response_template_file_id:
                    data.response_template_file_id || '',
                is_active: data.is_active ?? true,
            });
        }
    }, [data]);

    const { uploadFile, uploading, uploadedFileName } = useFileUpload("/api/configuration/data-models/template-upload");

    const handleFileUpload = async (file: File) => {
        const documentId = await uploadFile(file);

        if (!documentId) return;

        setFormData((prev) => ({
            ...prev,
            response_template_file_id: documentId,
        }));
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await handleFileUpload(file);

        e.target.value = '';
    };

    const handleSubmit = async () => {
        if (!formData.data_model_mnemonic || !formData.pattern_for_data_model) {
            toast.warn('Mnemonic & Pattern are required');
            return;
        }

        const result = await updateDataModel(
            '/api/configuration/data-models/update',
            {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    data_model_id: data?.data_model_id,
                }),
            }
        );

        if (result) {
            toast.success(`Updated "${formData.data_model_mnemonic}"`);
            onSuccess?.();
            onClose();
        } else {
            toast.error('Update failed');
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-150 bg-white rounded-[10px] border-5 border-[#F2BA1A] p-10">
                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 opacity-50"
                >
                    <X size={30} />
                </button>

                <h2 className="text-[24px] text-[#ED7C22] font-medium mb-4">
                    {t('edit_data_model')}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[16px] font-medium text-black">
                            {t('mnemonic')}
                        </label>
                        <input
                            value={formData.data_model_mnemonic}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    data_model_mnemonic: e.target.value,
                                })
                            }
                            className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px] outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[16px] font-medium text-black">
                            {t('pattern')}
                        </label>
                        <input
                            value={formData.pattern_for_data_model}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    pattern_for_data_model: e.target.value,
                                })
                            }
                            className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px] outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[16px] font-medium text-black">
                                {t('template_id')}
                            </label>

                            <div className="mt-2 flex items-center gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-10 h-10 border-2 border-dashed border-[#F77F57] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors shrink-0"
                                >
                                    <Upload className="text-[#F77F57]" size={20} />
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-[#F77F57] font-medium"
                                    >
                                        {uploading
                                            ? 'Uploading...'
                                            : formData.response_template_file_id
                                                ? 'Change File'
                                                : 'Upload File'}
                                    </button>

                                    {formData.response_template_file_id && (
                                        <p className="text-[#77D79B] mt-1 text-xs">
                                            {uploadedFileName}
                                        </p>
                                    )}
                                </div>
                                {formData.response_template_file_id && (
                                    <button
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                response_template_file_id: '',
                                            }))
                                        }
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-[16px] font-medium text-black">
                                {t('status')}
                            </label>

                            <div className="mt-2 flex items-center gap-3 h-10.5">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 cursor-pointer"
                                />

                                <span className="text-sm text-gray-700">
                                    {formData.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-[#DDDDDD] text-[#00000080] rounded-[10px]"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-black text-white rounded-[10px]"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}