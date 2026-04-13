'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { useAllIncomingKeyPaths } from '@/features/configuration/shared/hooks/useAllIncomingKeyPaths';
import { useAllDataModels } from '@/features/configuration/shared';

interface EditKeyPathModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: any;
}

export default function EditKeyPathModal({
    isOpen,
    onClose,
    onSuccess,
    initialData
}: EditKeyPathModalProps) {
    const t = useTranslations();
    const { execute: updateKeyPath } = useFetch();
    const { dataModels } = useAllDataModels(1, 100);

    const [formData, setFormData] = useState({
        data_model_id: '',
        key_path_for_message_id: '',
        key_path_for_sender: '',
        key_path_for_signature: '',
        key_path_for_signature_payload: '',
        is_list: false,
        key_path_for_list_elements: '',
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                data_model_id: initialData.data_model_id || '',
                key_path_for_message_id: initialData.key_path_for_message_id || '',
                key_path_for_sender: initialData.key_path_for_sender || '',
                key_path_for_signature: initialData.key_path_for_signature || '',
                key_path_for_signature_payload: initialData.key_path_for_signature_payload || '',
                is_list: initialData.is_list || false,
                key_path_for_list_elements: initialData.key_path_for_list_elements || '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!initialData?.key_path_id) return;

        const result = await updateKeyPath('/api/configuration/ingest/update-key-path', {
            method: 'POST',
            body: JSON.stringify({
                key_path_id: initialData.key_path_id,
                key_path_for_message_id: formData.key_path_for_message_id || null,
                key_path_for_sender: formData.key_path_for_sender || null,
                key_path_for_signature: formData.key_path_for_signature || null,
                key_path_for_signature_payload: formData.key_path_for_signature_payload || null,
                is_list: formData.is_list,
                key_path_for_list_elements: formData.key_path_for_list_elements || null,
            })
        });

        if (result?.key_path_id) {
            toast.success(t('toast_key_path_updated'));
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error(t('toast_key_path_update_failed'));
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

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">{t('edit_key_path')}</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                {t('data_model')}
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.data_model_id}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none text-gray-400 cursor-not-allowed appearance-none"
                                >
                                    <option value="">{t('select_data_model')}</option>
                                    {dataModels.map((dm) => (
                                        <option key={dm.data_model_id} value={dm.data_model_id}>{dm.data_model_mnemonic}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('message_id')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('message_id')}
                                    value={formData.key_path_for_message_id}
                                    onChange={(e) => setFormData({ ...formData, key_path_for_message_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('sender')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('sender')}
                                    value={formData.key_path_for_sender}
                                    onChange={(e) => setFormData({ ...formData, key_path_for_sender: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('signature')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('signature')}
                                    value={formData.key_path_for_signature}
                                    onChange={(e) => setFormData({ ...formData, key_path_for_signature: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('signature_payload')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('signature_payload')}
                                    value={formData.key_path_for_signature_payload}
                                    onChange={(e) => setFormData({ ...formData, key_path_for_signature_payload: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('is_list')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.is_list ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, is_list: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="true">{t('true')}</option>
                                        <option value="false">{t('false')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('list_elements')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('list_elements')}
                                    value={formData.key_path_for_list_elements}
                                    onChange={(e) => setFormData({ ...formData, key_path_for_list_elements: e.target.value })}
                                    disabled={!formData.is_list}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 disabled:opacity-50 placeholder:text-gray-400"
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
