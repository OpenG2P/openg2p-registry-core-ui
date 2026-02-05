'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { Register } from '../types';

interface ViewRegisterFieldsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: Register;
}

export default function ViewRegisterFieldsModal({
    isOpen,
    onClose,
    data,
}: ViewRegisterFieldsModalProps) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 ">
            <div className="relative w-full max-w-[800px] max-h-[95vh] bg-[#F2BA1A] rounded-[20px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[20px] p-10 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-6">
                        {data.register_mnemonic} Details
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Register Name</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_mnemonic || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Register Subject</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_subject || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Description</div>
                            <div className="flex-1 text-[16px] text-black font-semibold leading-relaxed text-wrap break-words">
                                {data.register_description || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Register Purpose</div>
                            <div className="flex-1 text-[16px] text-black font-bold uppercase">
                                {data.register_purpose || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Master Register</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.master_register_mnemonic || data.master_register_id || '-'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Deduplication Enabled</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.dedup_is_enabled ? 'True' : 'False'}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Dedup Threshold Score</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.dedup_threshold_score ?? 0}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Register Rank</div>
                            <div className="flex-1 text-[16px] text-black font-bold">
                                {data.register_rank ?? 0}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-[220px] text-[16px] text-gray-400 font-medium shrink-0">Register Icon</div>
                            <div className="flex-1">
                                {data.register_icon ? (
                                    <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                                        <Image
                                            src={data.register_icon}
                                            alt="Registry Logo"
                                            width={120}
                                            height={120}
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <span className="text-gray-500 italic text-sm">No icon uploaded</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-start">
                        <button
                            onClick={onClose}
                            className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
