import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAllRegister } from '../shared/hooks/useAllRegister';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { Register } from '../shared/types';
import { BaseModal, CustomDropdown, InputField, TextAreaField } from '../shared/components';




interface AddSectionModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddSectionModal({ onClose, onSuccess }: AddSectionModalProps) {
    const t = useTranslations();
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const { config } = useRuntimeConfig();
    const { execute: createSection, loading } = useFetch();
    const { registers, loading: registersLoading } = useAllRegister(1, 100);


    const [formData, setFormData] = useState({
        section_register_id: '',
        section_mnemonic: '',
        section_description: '',
        documents_required: false,
        no_of_verifications_required: '',
        auto_approval: false,
        is_list: false,
        is_primary_section: false,
        is_core_section: false,
        section_order: '',
    });

    const handleSubmit = async () => {
        if (!formData.section_mnemonic) {
            toast.warn('Section Name is required');
            return;
        }

        if (!formData.section_register_id) {
            toast.warn('Section Register is required');
            return;
        }

        const result = await createSection('/api/configuration/registers/tabs/sections/create', {
            method: 'POST',
            body: JSON.stringify({
                section_register_id: formData.section_register_id,
                register_id: registerId,
                tab_id: tabId,
                section_mnemonic: formData.section_mnemonic,
                section_description: formData.section_description,
                documents_required: formData.documents_required,
                no_of_verifications_required: Number(formData.no_of_verifications_required) || 0,
                auto_approval: formData.auto_approval,
                is_list: formData.is_list,
                is_primary_section: formData.is_primary_section,
                is_core_section: formData.is_core_section,
                section_order: Number(formData.section_order) || 0,
                section_ui_schema: {}
            })
        });

        if (result?.section_id) {
            toast.success('Section created successfully');
            setFormData({
                section_register_id: '',
                section_mnemonic: '',
                section_description: '',
                documents_required: false,
                no_of_verifications_required: '',
                auto_approval: false,
                is_list: false,
                is_primary_section: false,
                is_core_section: false,
                section_order: '',
            });
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create section');
        }
    };

    const handleCancel = () => {
        setFormData({
            section_register_id: '',
            section_mnemonic: '',
            section_description: '',
            documents_required: false,
            no_of_verifications_required: '',
            auto_approval: false,
            is_list: false,
            is_primary_section: false,
            is_core_section: false,
            section_order: '',
        });
        onClose();
    };

    return (
        <BaseModal
            title={t('add_new_section')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
            maxWidth="max-w-200"
        >
            <InputField
                label={t('section_name')}
                value={formData.section_mnemonic}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        section_mnemonic: value,
                    }))
                }
            />

            <TextAreaField
                label={t('description')}
                value={formData.section_description}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        section_description: value,
                    }))
                }
                rows={1}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('no_of_verifications_required')}
                    type='number'
                    min={0}
                    value={formData.no_of_verifications_required}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            no_of_verifications_required: value,
                        }))
                    }
                />

                <CustomDropdown
                    label={t('documents_required')}
                    value={formData.documents_required ? 'true' : 'false'}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            documents_required: value === 'true',
                        }))
                    }
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                    label={t('auto_approval')}
                    value={formData.auto_approval ? 'true' : 'false'}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            auto_approval: value === 'true',
                        }))
                    }
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                />

                <CustomDropdown
                    label={t('is_list')}
                    value={formData.is_list ? 'true' : 'false'}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_list: value === 'true',
                        }))
                    }
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                    label={t('section_register')}
                    value={formData.section_register_id}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            section_register_id: value,
                        }))
                    }
                    options={[
                        { label: t('select_register'), value: '' },
                        ...registers.map((reg: Register) => ({
                            label: reg.register_mnemonic,
                            value: reg.register_id,
                        })),
                    ]}
                    loading={registersLoading}
                />

                <CustomDropdown
                    label={t('is_primary_section')}
                    value={formData.is_primary_section ? 'true' : 'false'}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_primary_section: value === 'true',
                        }))
                    }
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('section_order')}
                    type="number"
                    value={formData.section_order}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            section_order: value,
                        }))
                    }
                />

                <CustomDropdown
                    label={t('is_core_section')}
                    value={formData.is_core_section ? 'true' : 'false'}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            is_core_section: value === 'true',
                        }))
                    }
                    options={[
                        { label: t('true'), value: 'true' },
                        { label: t('false'), value: 'false' },
                    ]}
                />
            </div>
        </BaseModal>
    );
}
