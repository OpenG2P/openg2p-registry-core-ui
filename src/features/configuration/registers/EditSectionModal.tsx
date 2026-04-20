import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Section } from '../shared/types';
import { BaseModal, CustomDropdown, InputField, TextAreaField } from '../shared/components';

interface EditSectionModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: Section;
}

export default function EditSectionModal({ onClose, onSuccess, initialData }: EditSectionModalProps) {
    const t = useTranslations();
    const { registerId, tabId, sectionId } = useParams<{ registerId: string; tabId: string; sectionId: string }>();
    const { execute: updateSection, loading } = useFetch();

    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (initialData) {
            setFormData({
                section_mnemonic: initialData.section_mnemonic || '',
                section_description: initialData.section_description || '',
                documents_required: !!initialData.documents_required,
                no_of_verifications_required: initialData.no_of_verifications_required?.toString() || '0',
                auto_approval: !!initialData.auto_approval,
                is_list: !!initialData.is_list,
                is_primary_section: !!initialData.is_primary_section,
                is_core_section: !!initialData.is_core_section,
                section_order: initialData.section_order?.toString() || '0',
            });
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (!formData.section_mnemonic) {
            toast.warn('Section Name is required');
            return;
        }

        const result = await updateSection('/api/configuration/registers/tabs/sections/update', {
            method: 'POST',
            body: JSON.stringify({
                section_id: sectionId,
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
            })
        });

        if (result) {
            toast.success('Section updated successfully');
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to update section');
        }
    };

    const handleCancel = () => {
        onClose();
    };
    return (
        <BaseModal
            title={t('edit_section')}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
