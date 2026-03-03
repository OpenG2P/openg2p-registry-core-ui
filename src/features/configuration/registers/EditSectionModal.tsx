import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';


import { Section } from '../shared/types';

interface EditSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: Section;
}

export default function EditSectionModal({ isOpen, onClose, onSuccess, initialData }: EditSectionModalProps) {
    const { registerId, tabId, sectionId } = useParams<{ registerId: string; tabId: string; sectionId: string }>();
    const { execute: updateSection, loading } = useFetch();

    const [formData, setFormData] = useState({
        section_mnemonic: '',
        section_description: '',
        documents_required: false,
        no_of_verifications_required: '',
        auto_approval: false,
        is_list: false,
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                section_mnemonic: initialData.section_mnemonic || '',
                section_description: initialData.section_description || '',
                documents_required: !!initialData.documents_required,
                no_of_verifications_required: initialData.no_of_verifications_required?.toString() || '0',
                auto_approval: !!initialData.auto_approval,
                is_list: !!initialData.is_list,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!formData.section_mnemonic) {
            toast.warn('Section Name is required');
            return;
        }

        const result = await updateSection('/api/configuration/registers/tabs/sections/update', {
            method: 'POST',
            body: JSON.stringify({
                section_id: sectionId,
                tab_id: tabId,
                section_mnemonic: formData.section_mnemonic,
                section_description: formData.section_description,
                documents_required: formData.documents_required,
                no_of_verifications_required: Number(formData.no_of_verifications_required) || 0,
                auto_approval: formData.auto_approval,
                is_list: formData.is_list,
            })
        });

        if (result) {
            toast.success('Section updated successfully');
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to update section');
        }
    };

    const handleCancel = () => {
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80  z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-[95vh] bg-[#F2BA1A] rounded-[10px] overflow-hidden flex p-1">

                <div className="flex-1 w-full bg-white p-10 relative rounded-[10px] overflow-y-auto">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Edit Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">
                                Section Name
                            </label>
                            <p className="text-[12px] text-gray-400 mb-2 italic">
                                * Use lowercase and underscores only (e.g., test_section)
                            </p>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. personal_info"
                                    value={formData.section_mnemonic}
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                        setFormData({ ...formData, section_mnemonic: value });
                                    }}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Description
                            </label>
                            <textarea
                                placeholder="Type your message here..."
                                value={formData.section_description}
                                onChange={(e) => setFormData({ ...formData, section_description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all resize-none text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    No of Verifications Required
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 0"
                                    value={formData.no_of_verifications_required}
                                    onChange={(e) => setFormData({ ...formData, no_of_verifications_required: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    Documents Required
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.documents_required ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, documents_required: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    Auto Approval
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.auto_approval ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, auto_approval: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    Is List
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.is_list ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, is_list: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-[10px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-black text-white rounded-[10px]"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
