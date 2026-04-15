'use client';

import { useState } from 'react';
import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useFileUpload } from '../shared/hooks/useFileUpload';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useAllRegister } from '../shared';
import { useAllDataModels } from '../shared/hooks/useAllDataModels';
import CustomDropdown from '../shared/components/CustomDropdown';

interface AddIngestionTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddIngestionTemplateModal({
    isOpen,
    onClose,
    onSuccess,
}: AddIngestionTemplateModalProps) {
    const t = useTranslations();
    const { execute: createIngestionTemplate, loading } = useFetch();
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
        jsonld_expansion_required: false
    });

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
        if (!formData.register_id || !formData.data_model_id) {
            toast.warn('Register Id & Data Model Id are required');
            return;
        }

        const result = await createIngestionTemplate(
            '/api/configuration/ingest/create-template',
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
                jsonld_expansion_required: false
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
            jsonld_expansion_required: false
        });

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
                    {t('add_new_ingestion_template')}
                </h2>

                <div className="space-y-4">
                    <div>
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
                    </div>
                    <div>
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
                    </div>
                    <div className='flex'>
                        <div className="mt-2 flex-1 items-center gap-4">
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
                            </div>
                        </div>
                        <div className="mt-2 flex-1 items-center gap-4">
                            <label className="text-[16px] font-medium text-black">
                                {t('jsonld_expansion')}
                            </label>
                            <div className="mt-2 flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={formData.jsonld_expansion_required || false}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            jsonld_expansion_required: e.target.checked,
                                        }))
                                    }
                                    className="w-4 h-4 cursor-pointer"
                                />
                            </div>
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
                            {t("save")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}