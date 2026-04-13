'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

interface AddSubscriptionActivityLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddSubscriptionActivityLogModal({ isOpen, onClose, onSuccess }: AddSubscriptionActivityLogModalProps) {
    const t = useTranslations();
    const { execute: createLog } = useFetch();

    const [formData, setFormData] = useState({
        partner_id: '',
        is_unsubscribe: false,
        description: '',
        subscription_url: '',
        registry_callback_url: '',
        header: '{}',
        payload: '{}',
        response: '{}',
    });

    const handleSubmit = async () => {
        if (!formData.partner_id) {
            toast.warn(t('partner_id') + ' is required');
            return;
        }

        try {
            const result = await createLog('/api/configuration/ingest/create-subscription-activity-log', {
                method: 'POST',
                body: JSON.stringify({
                    partner_id: formData.partner_id,
                    is_unsubscribe: formData.is_unsubscribe,
                    description: formData.description || null,
                    subscription_url: formData.subscription_url || null,
                    registry_callback_url: formData.registry_callback_url || null,
                    header: JSON.parse(formData.header),
                    payload: JSON.parse(formData.payload),
                    response: JSON.parse(formData.response),
                })
            });

            if (result?.subscription_activity_log_id) {
                toast.success(t('toast_subscription_log_created'));
                resetForm();
                if (onSuccess) onSuccess();
                onClose();
            } else {
                toast.error(t('toast_subscription_log_create_failed'));
            }
        } catch (e) {
            toast.error(t('invalid_json_format'));
        }
    };

    const resetForm = () => {
        setFormData({
            partner_id: '',
            is_unsubscribe: false,
            description: '',
            subscription_url: '',
            registry_callback_url: '',
            header: '{}',
            payload: '{}',
            response: '{}',
        });
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

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">{t('add_subscription_log')}</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('partner_id')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('partner_id')}
                                    value={formData.partner_id}
                                    onChange={(e) => setFormData({ ...formData, partner_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('unsubscribe')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.is_unsubscribe ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, is_unsubscribe: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="true">{t('true')}</option>
                                        <option value="false">{t('false')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                {t('description')}
                            </label>
                            <textarea
                                placeholder={t('description')}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 h-20 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('subscription_url')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('subscription_url')}
                                    value={formData.subscription_url}
                                    onChange={(e) => setFormData({ ...formData, subscription_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('callback_url')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('callback_url')}
                                    value={formData.registry_callback_url}
                                    onChange={(e) => setFormData({ ...formData, registry_callback_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('header')} (JSON)
                                </label>
                                <textarea
                                    value={formData.header}
                                    onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 h-24 font-mono text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('payload')} (JSON)
                                </label>
                                <textarea
                                    value={formData.payload}
                                    onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 h-24 font-mono text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    {t('response')} (JSON)
                                </label>
                                <textarea
                                    value={formData.response}
                                    onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 h-24 font-mono text-xs"
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
