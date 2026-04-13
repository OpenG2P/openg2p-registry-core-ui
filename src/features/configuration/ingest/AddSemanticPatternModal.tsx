'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useAllRegister, useConfigTabs, useConfigSections, useAllDataModels } from '@/features/configuration/shared';

interface AddSemanticPatternModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddSemanticPatternModal({ isOpen, onClose, onSuccess }: AddSemanticPatternModalProps) {
    const t = useTranslations();
    const { execute: createPattern } = useFetch();
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

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">{t('add_new_semantic_pattern')}</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('data_model')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.data_model_id}
                                        onChange={(e) => setFormData({ ...formData, data_model_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="">{t('select_data_model')}</option>
                                        {dataModels.map((dm) => (
                                            <option key={dm.data_model_id} value={dm.data_model_id}>{dm.data_model_mnemonic}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('register')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.register_id}
                                        onChange={(e) => setFormData({ ...formData, register_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="">{t('select_register')}</option>
                                        {registers.map((r) => (
                                            <option key={r.register_id} value={r.register_id}>{r.register_mnemonic}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('tab')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedTabId}
                                        onChange={(e) => setSelectedTabId(e.target.value)}
                                        disabled={!formData.register_id || loadingTabs}
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
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
