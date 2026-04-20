'use client';

import { useState, useRef } from 'react';
import { X, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAllRegister } from '../shared/hooks/useAllRegister';
import { useFetch } from '@/shared/hooks';

import { toast } from 'react-toastify';
import { Register } from '../shared/types';
import { convertImageToBase64 } from '../shared/utils/convertImageToBase64';
import { BaseModal, CustomDropdown, FileUploadField, InputField, TextAreaField } from '../shared/components';


interface AddRegisterModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddRegisterModal({ onClose, onSuccess }: AddRegisterModalProps) {
    const t = useTranslations();
    const { registers } = useAllRegister(1, 100);
    const { execute: createRegister, loading: creating } = useFetch();
    const fileInputRef = useRef<HTMLInputElement>(null);



    const [formData, setFormData] = useState({
        register_mnemonic: '',
        register_description: '',
        master_register_id: '',
        dedup_is_enabled: false,
        dedup_threshold_score: '',
        register_icon: '',
        register_rank: '',
        register_purpose: 'REGISTER',
        functional_id_generation_required: false,
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size must be less than 2MB');
                return;
            }

            try {
                const base64 = await convertImageToBase64(file);
                setFormData(prev => ({ ...prev, register_icon: base64 }));
            } catch (error) {
                toast.error('Failed to process image');
            }
        }
    };



    const handleSubmit = async () => {
        if (!formData.register_mnemonic || !formData.register_description || !formData.register_purpose) {
            toast.warn('Basic fields (Mnemonic, Description, Purpose) are required');
            return;
        }

        const result = await createRegister('/api/configuration/registers/create', {
            method: 'POST',
            body: JSON.stringify({
                register_mnemonic: formData.register_mnemonic,
                register_description: formData.register_description,
                master_register_id: formData.master_register_id || null,
                dedup_is_enabled: formData.dedup_is_enabled,
                dedup_threshold_score: Number(formData.dedup_threshold_score) || 0,
                register_icon: formData.register_icon,
                register_rank: Number(formData.register_rank) || 0,
                register_purpose: formData.register_purpose,
                functional_id_generation_required: formData.functional_id_generation_required,
            })
        });

        if (result?.register_id) {
            toast.success(`Register "${result.register_mnemonic}" created successfully`);

            // Reset form
            setFormData({
                register_mnemonic: '',
                register_description: '',
                master_register_id: '',
                dedup_is_enabled: false,
                dedup_threshold_score: '',
                register_icon: '',
                register_rank: '',
                register_purpose: 'REGISTER',
                functional_id_generation_required: false,
            });

            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create register');
        }
    };

    const handleCancel = () => {
        setFormData({
            register_mnemonic: '',
            register_description: '',
            master_register_id: '',
            dedup_is_enabled: false,
            dedup_threshold_score: '',
            register_icon: '',
            register_rank: '',
            register_purpose: 'REGISTER',
            functional_id_generation_required: false,
        });
        onClose();
    };

    return (
        <BaseModal
            title={t('add_new_register')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
            maxWidth="max-w-200"
        >
            <InputField
                label={t('register_mnemonic')}
                value={formData.register_mnemonic}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        register_mnemonic: value,
                    }))
                }
            />

            <TextAreaField
                label={t('register_description')}
                value={formData.register_description}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        register_description: value,
                    }))
                }
                rows={1}
            />

            <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                    label={t('register_purpose')}
                    value={formData.register_purpose}
                    options={[
                        { label: 'REGISTER', value: 'REGISTER' },
                        {
                            label: 'PROGRAM_APPLICATION',
                            value: 'PROGRAM_APPLICATION',
                        },
                        { label: 'TABLE', value: 'TABLE' },
                    ]}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            register_purpose: value,
                        }))
                    }
                />

                <CustomDropdown
                    label={t('master_register')}
                    value={formData.master_register_id}
                    options={[
                        {
                            label: t('select_master_register'),
                            value: '',
                        },
                        ...registers.map((r) => ({
                            label: r.register_mnemonic,
                            value: r.register_id,
                        })),
                    ]}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            master_register_id: value,
                        }))
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                    label={t('deduplication_enabled')}
                    value={formData.dedup_is_enabled ? 'true' : 'false'}
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            dedup_is_enabled: value === 'true',
                        }))
                    }
                />

                <InputField
                    label={t('dedup_threshold_score')}
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={formData.dedup_threshold_score}
                    disabled={!formData.dedup_is_enabled}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            dedup_threshold_score: value,
                        }))
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                    label={t('functional_id_generation_required')}
                    value={
                        formData.functional_id_generation_required
                            ? 'true'
                            : 'false'
                    }
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            functional_id_generation_required:
                                value === 'true',
                        }))
                    }
                />
                <InputField
                    label={t('register_rank')}
                    type="number"
                    min={0}
                    value={formData.register_rank}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            register_rank: value,
                        }))
                    }
                />
            </div>
            <div>
                <label className="text-[16px] font-medium text-black">
                    {t('register_icon')}
                </label>
                <div className="flex items-center gap-4 mt-2">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 border-2 border-dashed border-[#F77F57] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors overflow-hidden shrink-0"
                    >
                        {formData.register_icon ? (
                            <img src={formData.register_icon} alt="icon" className="w-full h-full object-cover" />
                        ) : (
                            <Upload className="text-[#F77F57]" size={20} />
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#F77F57] font-medium"
                        >
                            {formData.register_icon ? t('change_icon') : t('upload_icon')}
                        </button>
                        <p className="text-[10px] text-black/50">{t('max_size_2mb')}</p>
                    </div>
                    {formData.register_icon && (
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, register_icon: '' }))}
                            className="text-[14px] text-red-500 hover:underline"
                        >
                            {t('remove')}
                        </button>
                    )}
                </div>
            </div>
        </BaseModal>
    );
}
