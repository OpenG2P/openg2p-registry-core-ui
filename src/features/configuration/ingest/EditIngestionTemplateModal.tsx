'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';
import { BaseModal, Field, FileUploadField, CheckboxField } from '../shared/components';


interface EditIngestionTemplateModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    data?: any;
}

export default function EditIngestionTemplateModal({
    onClose,
    onSuccess,
    data,
}: EditIngestionTemplateModalProps) {
    const t = useTranslations();
    const { execute: updateIngestionTemplate } = useFetch();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        template_id: '',
        template_file_id: '',
        jsonld_expansion_required: false
    });

    useEffect(() => {
        if (data) {
            setFormData({
                template_id: data.template_id || '',
                template_file_id: data.template_file_id || '',
                jsonld_expansion_required: data.jsonld_expansion_required || false
            });
        }
    }, [data]);

    const { uploadFile, uploading, uploadedFileName, setUploadedFileName } = useFileUpload("/api/configuration/ingest/upload-template");

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
        const result = await updateIngestionTemplate(
            '/api/configuration/ingest/update-template',
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
                jsonld_expansion_required: false
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
            title={t('edit_ingestion_templates')}
            onClose={handleCancel}
            primaryActionLabel={t('update')}
            onPrimaryAction={handleSubmit}
        >
            <Field label={t('register_mnemonic')} value={data.register_mnemonic} />
            <Field label={t('data_model_mnemonic')} value={data.data_model_mnemonic} />
            <div className="flex gap-6">
                <div className="flex-1">
                    <FileUploadField
                        label={t('template_id')}
                        fileInputRef={fileInputRef}
                        uploading={uploading}
                        fileId={formData.template_file_id}
                        fileName={uploadedFileName}
                        onFileChange={handleFileChange}
                    />
                </div>

                <div className="flex-1">
                    <CheckboxField
                        label={t('jsonld_expansion')}
                        checked={formData.jsonld_expansion_required}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                jsonld_expansion_required: value,
                            }))
                        }
                    />
                </div>
            </div>
        </BaseModal>
    );
}