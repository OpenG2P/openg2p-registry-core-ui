import { X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ActionModalProps {
    isOpen: boolean;
    type: 'warning' | 'success' | 'error';
    title: string;
    subtitle: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    hideCancel?: boolean;
}

export default function ActionModal({
    isOpen,
    type,
    title,
    subtitle,
    onClose,
    onConfirm,
    confirmText,
    cancelText,
    hideCancel = false,
}: ActionModalProps) {
    const t = useTranslations();
    const finalConfirmText = confirmText || t('save');
    const finalCancelText = cancelText || t('cancel');

    if (!isOpen) return null;

    const borderColor = type === 'warning' ? 'border-[#F2BA1A]' : type === 'error' ? 'border-[#EF8F93]' : 'border-[#10C469]';

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className={`relative w-full max-w-[450px] bg-white rounded-[20px] shadow-lg flex flex-col items-center p-8 border-4 ${borderColor}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} strokeWidth={2} />
                </button>

                <div className="mb-6 mt-4">
                    {type === 'warning' ? (
                        <div className="w-20 h-20 bg-[#FFF5D6] rounded-full flex items-center justify-center">
                            <div className="w-14 h-14 bg-[#FFC107] rounded-full flex items-center justify-center">
                                <span className="text-white text-[32px] font-bold">!</span>
                            </div>
                        </div>
                    ) : type === 'error' ? (
                        <div className="w-20 h-20 relative rounded-full flex items-center justify-center border-10 border-[#EF8F93]/10 bg-[#EF8F93]/80">
                            <Image
                                src="/images/common/wrongsymbol.png"
                                alt={t('error')}
                                width={41}
                                height={30}
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-20 h-20 relative rounded-full flex items-center justify-center border-10 border-[#77D79B]/10 bg-[#77D79B]/80">
                            <Image
                                src="/images/common/rightsymbol.png"
                                alt={t('success')}
                                width={41}
                                height={30}
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>

                <h2 className="text-[22px] font-bold text-black mb-2 text-center">{title}</h2>
                <p className="text-[#717171] text-[14px] text-center mb-8 px-4">
                    {subtitle}
                </p>

                <div className="flex gap-4 w-full justify-center">
                    {!hideCancel && (
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 bg-[#E1E1E1] text-black font-semibold rounded-full hover:bg-gray-300 transition-colors text-[14px]"
                        >
                            {finalCancelText}
                        </button>
                    )}
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-8 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-[14px]"
                        >
                            {finalConfirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
