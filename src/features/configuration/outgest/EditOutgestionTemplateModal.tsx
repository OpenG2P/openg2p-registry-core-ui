'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useAllRegister } from '../shared';
import { useAllDataModels } from '../shared/hooks/useAllDataModels';
import CustomDropdown from '../shared/components/CustomDropdown';

interface EditOutgestionTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    data?: any;
}

export default function EditOutgestionTemplateModal({
    isOpen,
    onClose,
    onSuccess,
    data,
}: EditOutgestionTemplateModalProps) {
    const t = useTranslations();
    const { execute: updateOutgestionTemplate } = useFetch();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        template_id: '',
        template_file_id: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                template_id: data.template_id || '',
                template_file_id: data.template_file_id || '',
            });
        }
    }, [data]);

    const { uploadFile, uploading, uploadedFileName, setUploadedFileName } = useFileUpload("/api/configuration/outgest/upload-template");

    const handleFileUpload = async (file: File) => {
        const documentId = await uploadFile(file);

        if (!documentId) return;

        setFormData((prev) => ({
            ...prev,
            template_file_id: documentId,
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
        const result = await updateOutgestionTemplate(
            '/api/configuration/outgest/update-template',
            {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    template_id: data?.template_id,
                }),
            }
        );

        if (result) {
            toast.success(t('template_updated', { id: formData.template_id }));
            setFormData({
                template_id: '',
                template_file_id: '',
            });
            setUploadedFileName('');
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
                    {t('edit_outgestion_templates')}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[16px] font-medium text-black">
                            {t('register_mnemonic')}
                        </label>
                        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px]">
                            {data.register_mnemonic || '-'}
                        </div>
                    </div>
                    <div>
                        <label className="text-[16px] font-medium text-black">
                            {t('data_model_mnemonic')}
                        </label>
                        <div className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px]">
                            {data.data_model_mnemonic || '-'}
                        </div>
                    </div>
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
                                        : formData.template_file_id
                                            ? 'Change File'
                                            : 'Upload File'}
                                </button>

                                {formData.template_file_id && (
                                    <p className="text-[#77D79B] mt-1 text-xs">
                                        {uploadedFileName}
                                    </p>
                                )}
                            </div>
                            {formData.template_file_id && (
                                <button
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            template_file_id: '',
                                        }))
                                    }
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    {t("remove")}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-[#DDDDDD] text-[#00000080] rounded-[10px]"
                        >
                            {t("cancel")}
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-black text-white rounded-[10px]"
                        >
                            {t("update")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}