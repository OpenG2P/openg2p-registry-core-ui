'use client';

import { useState } from 'react';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useAllRegister } from '../shared';
import { useAllDataModels } from '../shared/hooks/useAllDataModels';
import { BaseModal, CustomDropdown, FileUploadField } from '../shared/components';


interface AddOutgestionTemplateModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddOutgestionTemplateModal({
    onClose,
    onSuccess,
}: AddOutgestionTemplateModalProps) {
    const t = useTranslations();
    const { execute: createOutgestionTemplate, loading } = useFetch();
    const { config } = useRuntimeConfig();
    const currentPage = 1;

    const { registers, loading: registersLoading } = useAllRegister(currentPage, config.pageSize);
    const { dataModels, loading: dataModelsLoading } = useAllDataModels(currentPage, config.pageSize);

    const registerOptions =
        registers?.map((item: any) => ({
            label: t(item.register_subject),
            value: item.register_id,
        })) || [];

    const dataModelOptions =
        dataModels?.map((item: any) => ({
            label: item.data_model_mnemonic,
            value: item.data_model_id,
        })) || [];

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        register_id: '',
        data_model_id: '',
        template_file_id: '',
    });

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
        if (!formData.register_id || !formData.data_model_id) {
            toast.warn('Register Id & Data Model Id are required');
            return;
        }

        const result = await createOutgestionTemplate(
            '/api/configuration/outgest/create-template',
            {
                method: 'POST',
                body: JSON.stringify(formData),
            }
        );

        if (result?.template_id) {
            toast.success(t('template_created', { id: result?.template_id }));

            setFormData({
                register_id: '',
                data_model_id: '',
                template_file_id: '',
            });
            setUploadedFileName('');

            onSuccess?.();
            onClose();
        } else {
            toast.error('Failed to create Template');
        }
    };

    const handleCancel = () => {
        setFormData({
            register_id: '',
            data_model_id: '',
            template_file_id: '',
        });

        onClose();
    };

    return (
        <BaseModal
            title={t('add_new_outgestion_template')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
        >
            <CustomDropdown
                label={t('register_id')}
                options={registerOptions}
                value={formData.register_id}
                loading={registersLoading}
                disabled={registersLoading}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        register_id: value,
                    }))
                }
            />
            <CustomDropdown
                label={t('data_model_id')}
                options={dataModelOptions}
                value={formData.data_model_id}
                loading={dataModelsLoading}
                disabled={dataModelsLoading}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        data_model_id: value,
                    }))
                }
            />
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