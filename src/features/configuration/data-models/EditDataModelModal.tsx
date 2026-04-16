'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';
import { BaseModal, InputField, FileUploadField, CheckboxField } from '../shared/components';

interface EditDataModelModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    data?: any;
}

export default function EditDataModelModal({
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

    return (
        <BaseModal
            title={t('edit_data_model')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
            maxWidth="max-w-150"
        >

            <InputField
                label={t('data_model_mnemonic')}
                value={formData.data_model_mnemonic}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        data_model_mnemonic: value,
                    }))
                }
            />

            <div className="grid grid-cols-2 gap-6">
                <FileUploadField
                    label={t('template_id')}
                    fileInputRef={fileInputRef}
                    uploading={uploading}
                    fileId={formData.response_template_file_id}
                    fileName={uploadedFileName}
                    onFileChange={handleFileChange}
                />

                <CheckboxField
                    label={t('status')}
                    checked={formData.is_active}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_active: value,
                        }))
                    }
                />
            </div>

            <InputField
                label={t('pattern')}
                value={formData.pattern_for_data_model}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        pattern_for_data_model: value,
                    }))
                }
            />
        </BaseModal>
    );
}