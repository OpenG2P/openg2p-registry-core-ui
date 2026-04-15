'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { IncomingSemanticPattern } from '@/features/configuration/shared/hooks/useAllSemanticPatterns';
import { useAllRegister, useConfigTabs, useConfigSections, useAllDataModels } from '@/features/configuration/shared';
import { BaseModal, InputField, CustomDropdown } from '../shared/components';

interface EditSemanticPatternModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IncomingSemanticPattern;
}

export default function EditSemanticPatternModal({
    onClose,
    onSuccess,
    initialData
}: EditSemanticPatternModalProps) {
    const t = useTranslations();
    const { execute: updatePattern } = useFetch();
    const { registers } = useAllRegister(1, 100);
    const { dataModels } = useAllDataModels(1, 100);

    const [formData, setFormData] = useState({
        semantic_pattern_id: '',
        data_model_id: '',
        register_id: '',
        section_id: '',
        pattern_for_register: '',
        pattern_for_section: '',
        key_path_for_business_payload: '',
        raw_payload_enricher_class: '',
    });

    const [selectedTabId, setSelectedTabId] = useState('');

    // Dynamic data for dropdowns
    const { tabs, loading: loadingTabs } = useConfigTabs(formData.register_id, 1, 100);
    const { sections, loading: loadingSections } = useConfigSections(formData.register_id, selectedTabId, 1, 100);

    useEffect(() => {
        if (initialData) {
            setFormData({
                semantic_pattern_id: initialData.semantic_pattern_id || '',
                data_model_id: initialData.data_model_id || '',
                register_id: initialData.register_id || '',
                section_id: initialData.section_id || '',
                pattern_for_register: initialData.pattern_for_register || '',
                pattern_for_section: initialData.pattern_for_section || '',
                key_path_for_business_payload: initialData.key_path_for_business_payload || '',
                raw_payload_enricher_class: initialData.raw_payload_enricher_class || '',
            });
            // Reset selection to force the user to select tab -> section or implement lookup
            setSelectedTabId('');
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (!initialData?.semantic_pattern_id) return;

        const result = await updatePattern('/api/configuration/ingest/update-semantic-pattern', {
            method: 'POST',
            body: JSON.stringify({
                semantic_pattern_id: initialData.semantic_pattern_id,
                section_id: formData.section_id || null, // Allow updating section via dropdown
                pattern_for_register: formData.pattern_for_register || null,
                pattern_for_section: formData.pattern_for_section || null,
                key_path_for_business_payload: formData.key_path_for_business_payload || null,
                raw_payload_enricher_class: formData.raw_payload_enricher_class || null,
            })
        });

        if (result?.semantic_pattern_id) {
            toast.success(t('toast_semantic_pattern_updated'));
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error(t('toast_semantic_pattern_update_failed'));
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <BaseModal
            title={t('edit_semantic_pattern')}
            onClose={handleCancel}
            primaryActionLabel={t('update')}
            onPrimaryAction={handleSubmit}
            maxWidth='max-w-220'
        >
            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('semantic_pattern_id')}
                    value={formData.semantic_pattern_id}
                    onChange={() => { }}
                />
                <CustomDropdown
                    label={t('data_model')}
                    options={dataModels.map((dm) => ({
                        label: dm.data_model_mnemonic,
                        value: dm.data_model_id,
                    }))}
                    value={formData.data_model_id}
                    disabled
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            data_model_id: value,
                        }))
                    }
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <InputField
                    label={t('register')}
                    value={
                        registers.find(
                            (r) => r.register_id === formData.register_id
                        )?.register_mnemonic || formData.register_id
                    }
                    onChange={() => { }}
                />

                <CustomDropdown
                    label={t('tab')}
                    options={tabs.map((t) => ({
                        label: t.tab_label,
                        value: t.tab_id,
                    }))}
                    value={selectedTabId}
                    disabled
                    onChange={setSelectedTabId}
                />

                <CustomDropdown
                    label={t('section')}
                    options={sections.map((s) => ({
                        label: s.section_mnemonic,
                        value: s.section_id,
                    }))}
                    value={formData.section_id}
                    disabled
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            section_id: value,
                        }))
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('pattern_for_register')}
                    value={formData.pattern_for_register}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            pattern_for_register: value,
                        }))
                    }
                />
                <InputField
                    label={t('pattern_for_section')}
                    value={formData.pattern_for_section}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            pattern_for_section: value,
                        }))
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('business_payload')}
                    value={formData.key_path_for_business_payload}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            key_path_for_business_payload: value,
                        }))
                    }
                />
                <InputField
                    label={t('enricher_class')}
                    value={formData.raw_payload_enricher_class}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            raw_payload_enricher_class: value,
                        }))
                    }
                />
            </div>
        </BaseModal>
    );
}
