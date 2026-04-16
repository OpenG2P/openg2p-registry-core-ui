'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';
import { BaseModal, Field, FileUploadField } from '../shared/components';

interface EditOutgestionTemplateModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    data?: any;
}

export default function EditOutgestionTemplateModal({
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

    return (
        <BaseModal
            title={t('edit_outgestion_templates')}
            onClose={handleCancel}
            primaryActionLabel={t('update')}
            onPrimaryAction={handleSubmit}
        >
            <Field label={t('register_mnemonic')} value={data.register_mnemonic} />
            <Field label={t('data_model_mnemonic')} value={data.data_model_mnemonic} />

            <FileUploadField
                label={t('template_id')}
                fileInputRef={fileInputRef}
                uploading={uploading}
                fileId={formData.template_file_id}
                fileName={uploadedFileName}
                onFileChange={handleFileChange}
            />
        </BaseModal>
    );
}