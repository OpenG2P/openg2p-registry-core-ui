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
import CustomDropdown from './CustomDropdown';

interface EditOutgestionTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    data?: any;
}

export default function EditOutgestionTopicModal({
    isOpen,
    onClose,
    onSuccess,
    data,
}: EditOutgestionTopicModalProps) {
    const t = useTranslations();
    const { execute: updateOutgestionTemplate } = useFetch();
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

    const [formData, setFormData] = useState({
        topic_id: '',
        register_id: '',
        data_model_id: '',
        websub_topic: '',
        description: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                topic_id: data.topic_id || '',
                register_id: data.register_id || '',
                data_model_id: data.data_model_id || '',
                websub_topic: data.websub_topic || '',
                description: data.description || '',
            });
        }
    }, [data]);


    const handleSubmit = async () => {
        if (!formData.register_id || !formData.data_model_id) {
            toast.warn('Register Id & Data Model Id are required');
            return;
        }

        const result = await updateOutgestionTemplate(
            '/api/configuration/outgestion-topic/update',
            {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    topic_id: data?.topic_id,
                }),
            }
        );

        if (result) {
            toast.success(`Updated "${formData.topic_id}"`);
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
                    <div>
                        <label className="text-[16px] font-medium text-black">
                            {t('websub_topic')}
                        </label>
                        <input
                            value={formData.websub_topic}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    websub_topic: e.target.value,
                                })
                            }
                            className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px] outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[16px] font-medium text-black">
                            {t('description')}
                        </label>
                        <input
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px] outline-none"
                        />
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