'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SubscriptionActivityLog } from '@/features/configuration/shared/hooks/useSubscriptionActivityLogs';

interface ViewSubscriptionActivityLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: SubscriptionActivityLog;
}

export default function ViewSubscriptionActivityLogModal({
    isOpen,
    onClose,
    data,
}: ViewSubscriptionActivityLogModalProps) {
    const t = useTranslations();

    if (!isOpen || !data) return null;

    const renderJSON = (obj: any) => {
        try {
            return (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2 overflow-x-auto">
                    <pre className="text-xs font-mono text-gray-700">
                        {JSON.stringify(obj, null, 2)}
                    </pre>
                </div>
            );
        } catch (e) {
            return <span className="text-gray-400 italic">Invalid JSON</span>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-240 max-h-[95vh] bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[10px] p-10 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-6">
                        {t('log_id')}: {data.subscription_activity_log_id}
                    </h2>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-40 text-[16px] text-gray-400 font-medium shrink-0">{t('partner_id')}</div>
                                <div className="flex-1 text-[16px] text-black font-bold">
                                    {data.partner_id}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-40 text-[16px] text-gray-400 font-medium shrink-0">{t('unsubscribe')}</div>
                                <div className="flex-1 text-[16px] text-black font-bold">
                                    {data.is_unsubscribe ? t('true') : t('false')}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-40 text-[16px] text-gray-400 font-medium shrink-0">{t('date_time')}</div>
                                <div className="flex-1 text-[16px] text-black font-bold">
                                    {new Date(data.date_time).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-40 text-[16px] text-gray-400 font-medium shrink-0">{t('subscription_url')}</div>
                                <div className="flex-1 text-[16px] text-black font-medium break-all">
                                    {data.subscription_url || '-'}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-40 text-[16px] text-gray-400 font-medium shrink-0">{t('callback_url')}</div>
                                <div className="flex-1 text-[16px] text-black font-medium break-all">
                                    {data.registry_callback_url || '-'}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="text-[16px] text-gray-400 font-medium mb-1">{t('description')}</div>
                                <div className="text-[16px] text-black font-semibold leading-relaxed">
                                    {data.description || '-'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 border-l border-gray-100 pl-8">
                            <div>
                                <div className="text-[16px] text-gray-400 font-medium">{t('header')}</div>
                                {renderJSON(data.header)}
                            </div>
                            <div>
                                <div className="text-[16px] text-gray-400 font-medium">{t('payload')}</div>
                                {renderJSON(data.payload)}
                            </div>
                            <div>
                                <div className="text-[16px] text-gray-400 font-medium">{t('response')}</div>
                                {renderJSON(data.response)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-start">
                        <button
                            onClick={onClose}
                            className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-[10px] hover:bg-gray-400 transition-colors font-semibold"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
