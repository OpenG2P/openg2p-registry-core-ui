'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { IncomingSemanticPattern } from '@/features/configuration/shared/hooks/useAllSemanticPatterns';
import { useAllRegister, useConfigTabs, useConfigSections } from '@/features/configuration/shared';

interface EditSemanticPatternModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IncomingSemanticPattern;
}

export default function EditSemanticPatternModal({
    isOpen,
    onClose,
    onSuccess,
    initialData
}: EditSemanticPatternModalProps) {
    const t = useTranslations();
    const { execute: updatePattern } = useFetch();
    const { registers } = useAllRegister(1, 100);

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
        if (initialData && isOpen) {
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
    }, [initialData, isOpen]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-[95vh] bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[10px] p-10 overflow-y-auto">

                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">{t('edit_semantic_pattern')}</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('semantic_pattern_id')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.semantic_pattern_id}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('data_model_id')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.data_model_id}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('register')}
                                </label>
                                <input
                                    type="text"
                                    value={initialData?.register_mnemonic || registers.find(r => r.register_id === formData.register_id)?.register_mnemonic || formData.register_id}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('tab')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedTabId}
                                        onChange={(e) => setSelectedTabId(e.target.value)}
                                        disabled={loadingTabs}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">{t('select_tab')}</option>
                                        {tabs.filter(tab => !tab.used_for_new_intake_form).map((tab) => (
                                            <option key={tab.tab_id} value={tab.tab_id}>{tab.tab_label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('section_id')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.section_id}
                                        onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                                        disabled={!selectedTabId || loadingSections}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">{t('select_section')}</option>
                                        {sections.map((sec) => (
                                            <option key={sec.section_id} value={sec.section_id}>{sec.section_mnemonic}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('pattern_for_register')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('pattern_for_register')}
                                    value={formData.pattern_for_register}
                                    onChange={(e) => setFormData({ ...formData, pattern_for_register: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('pattern_for_section')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('pattern_for_section')}
                                    value={formData.pattern_for_section}
                                    onChange={(e) => setFormData({ ...formData, pattern_for_section: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('business_payload')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('business_payload')}
                                    value={formData.key_path_for_business_payload}
                                    onChange={(e) => setFormData({ ...formData, key_path_for_business_payload: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('enricher_class')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('enricher_class')}
                                    value={formData.raw_payload_enricher_class}
                                    onChange={(e) => setFormData({ ...formData, raw_payload_enricher_class: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 pb-2">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-[10px] hover:bg-gray-400 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-black text-white rounded-[10px] hover:bg-gray-800 transition-colors"
                            >
                                {t('update')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
