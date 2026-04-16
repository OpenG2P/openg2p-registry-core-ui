'use client';

import { X } from 'lucide-react';

interface BaseModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    primaryActionLabel?: string;
    onPrimaryAction?: () => void;
    maxWidth?: string;
    hideCancel?: boolean;
    secondaryActionLabel?: string;
}

export default function BaseModal({
    title,
    onClose,
    children,
    primaryActionLabel,
    onPrimaryAction,
    maxWidth = 'max-w-150',
    hideCancel = false,
    secondaryActionLabel,
}: BaseModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className={`relative w-full ${maxWidth} bg-white rounded-[10px] border-5 border-[#F2BA1A] px-8 py-6`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] text-[#ED7C22] font-medium">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="opacity-50 hover:opacity-100 transition"
                    >
                        <X size={30} />
                    </button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                    <div className="flex gap-4 pt-6">
                        {!hideCancel && (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-[#DDDDDD] text-[#00000080] text-[16px] font-bold rounded-[10px]"
                            >
                                {secondaryActionLabel || 'Cancel'}
                            </button>
                        )}

                        {primaryActionLabel && onPrimaryAction && (
                            <button
                                onClick={onPrimaryAction}
                                className="px-6 py-2 bg-black text-white text-[16px] font-bold rounded-[10px]"
                            >
                                {primaryActionLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}