'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useAllRegister, useConfigTabs, useConfigSections, useAllDataModels } from '@/features/configuration/shared';
import { BaseModal, CustomDropdown, InputField } from '../shared/components';

interface AddSemanticPatternModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddSemanticPatternModal({ onClose, onSuccess }: AddSemanticPatternModalProps) {
    const t = useTranslations();
    const { execute: createPattern } = useFetch();
    const { registers, loading: loadingRegisters } = useAllRegister(1, 100);
    const { dataModels, loading: loadingDataModels } = useAllDataModels(1, 100);

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

    // Reset Tab/Section when Register changes
    useEffect(() => {
        setSelectedTabId('');
        setFormData(prev => ({ ...prev, section_id: '' }));
    }, [formData.register_id]);

    // Reset Section when Tab changes
    useEffect(() => {
        setFormData(prev => ({ ...prev, section_id: '' }));
    }, [selectedTabId]);

    const handleSubmit = async () => {
        if (!formData.data_model_id || !formData.register_id) {
            toast.warn(t('data_model_id') + ' and ' + t('register_id') + ' are required');
            return;
        }

        const result = await createPattern('/api/configuration/ingest/create-semantic-pattern', {
            method: 'POST',
            body: JSON.stringify({
                semantic_pattern_id: formData.semantic_pattern_id || null,
                data_model_id: formData.data_model_id,
                register_id: formData.register_id,
                section_id: formData.section_id || null,
                pattern_for_register: formData.pattern_for_register || null,
                pattern_for_section: formData.pattern_for_section || null,
                key_path_for_business_payload: formData.key_path_for_business_payload || null,
                raw_payload_enricher_class: formData.raw_payload_enricher_class || null,
            })
        });

        if (result?.semantic_pattern_id) {
            toast.success(t('toast_semantic_pattern_created'));
            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error(t('toast_semantic_pattern_create_failed'));
        }
    };

    const resetForm = () => {
        setFormData({
            semantic_pattern_id: '',
            data_model_id: '',
            register_id: '',
            section_id: '',
            pattern_for_register: '',
            pattern_for_section: '',
            key_path_for_business_payload: '',
            raw_payload_enricher_class: '',
        });
        setSelectedTabId('');
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        <BaseModal
            title={t('add_new_semantic_pattern')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
            maxWidth='max-w-220'
        >
            <div className="grid grid-cols-1 gap-4">
                <CustomDropdown
                    label={t('data_model')}
                    options={dataModels.map(dm => ({
                        label: dm.data_model_mnemonic,
                        value: dm.data_model_id,
                    }))}
                    loading={loadingDataModels}
                    value={formData.data_model_id}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, data_model_id: value }))
                    }
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <CustomDropdown
                    label={t('register')}
                    options={registers.map(r => ({
                        label: r.register_mnemonic,
                        value: r.register_id,
                    }))}
                    loading={loadingRegisters}
                    value={formData.register_id}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, register_id: value }))
                    }
                />
                <CustomDropdown
                    label={t('tab')}
                    options={tabs
                        .filter(tab => !tab.used_for_new_intake_form)
                        .map(tab => ({
                            label: tab.tab_label,
                            value: tab.tab_id,
                        }))}
                    loading={loadingTabs}
                    value={selectedTabId}
                    disabled={!formData.register_id || loadingTabs}
                    onChange={setSelectedTabId}
                />
                <CustomDropdown
                    label={t('section')}
                    options={sections.map(sec => ({
                        label: sec.section_mnemonic,
                        value: sec.section_id,
                    }))}
                    loading={loadingSections}
                    value={formData.section_id}
                    disabled={!selectedTabId || loadingSections}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, section_id: value }))
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('pattern_for_register')}
                    value={formData.pattern_for_register}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, pattern_for_register: value }))
                    }
                />
                <InputField
                    label={t('pattern_for_section')}
                    value={formData.pattern_for_section}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, pattern_for_section: value }))
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label={t('business_payload')}
                    value={formData.key_path_for_business_payload}
                    onChange={(value) =>
                        setFormData(prev => ({
                            ...prev,
                            key_path_for_business_payload: value
                        }))
                    }
                />
                <InputField
                    label={t('enricher_class')}
                    value={formData.raw_payload_enricher_class}
                    onChange={(value) =>
                        setFormData(prev => ({
                            ...prev,
                            raw_payload_enricher_class: value
                        }))
                    }
                />
            </div>
        </BaseModal>
    );
}
