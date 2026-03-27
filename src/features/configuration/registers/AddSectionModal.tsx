import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAllRegister } from '../shared/hooks/useAllRegister';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { Register } from '../shared/types';




interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddSectionModal({ isOpen, onClose, onSuccess }: AddSectionModalProps) {
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const { config } = useRuntimeConfig();
    const { execute: createSection, loading } = useFetch();
    const { registers, loading: registersLoading } = useAllRegister(1, 100);


    const [formData, setFormData] = useState({
        section_register_id: '',
        section_mnemonic: '',
        section_description: '',
        documents_required: false,
        no_of_verifications_required: '',
        auto_approval: false,
        is_list: false,
        is_primary_section: false,
        is_core_section: false,
        section_order: '',
    });

    const handleSubmit = async () => {
        if (!formData.section_mnemonic) {
            toast.warn('Section Name is required');
            return;
        }

        if (!formData.section_register_id) {
            toast.warn('Section Register is required');
            return;
        }

        const result = await createSection('/api/configuration/registers/tabs/sections/create', {
            method: 'POST',
            body: JSON.stringify({
                section_register_id: formData.section_register_id,
                register_id: registerId,
                tab_id: tabId,
                section_mnemonic: formData.section_mnemonic,
                section_description: formData.section_description,
                documents_required: formData.documents_required,
                no_of_verifications_required: Number(formData.no_of_verifications_required) || 0,
                auto_approval: formData.auto_approval,
                is_list: formData.is_list,
                is_primary_section: formData.is_primary_section,
                is_core_section: formData.is_core_section,
                section_order: Number(formData.section_order) || 0,
                section_ui_schema: {}
            })
        });

        if (result?.section_id) {
            toast.success('Section created successfully');
            setFormData({
                section_register_id: '',
                section_mnemonic: '',
                section_description: '',
                documents_required: false,
                no_of_verifications_required: '',
                auto_approval: false,
                is_list: false,
                is_primary_section: false,
                is_core_section: false,
                section_order: '',
            });
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create section');
        }
    };

    const handleCancel = () => {
        setFormData({
            section_register_id: '',
            section_mnemonic: '',
            section_description: '',
            documents_required: false,
            no_of_verifications_required: '',
            auto_approval: false,
            is_list: false,
            is_primary_section: false,
            is_core_section: false,
            section_order: '',
        });
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

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Add New Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">
                                Section Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Section Name"
                                    value={formData.section_mnemonic}
                                    onChange={(e) => setFormData({ ...formData, section_mnemonic: e.target.value })}
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

                        <div className="grid grid-cols-2 gap-4" >
                            <div>
                                <label className="block text-sm font-semibold text-black mb-1">
                                    Section Register
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.section_register_id}
                                        onChange={(e) => setFormData({ ...formData, section_register_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600 pr-10"
                                        disabled={registersLoading}
                                    >
                                        <option value="">Select Register</option>
                                        {registers.map((reg: Register) => (
                                            <option key={reg.register_id} value={reg.register_id}>
                                                {reg.register_mnemonic}
                                            </option>
                                        ))}

                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    Is Primary Section
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.is_primary_section ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, is_primary_section: e.target.value === "true" })}
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
                                    Section Order
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 0"
                                    value={formData.section_order}
                                    onChange={(e) => setFormData({ ...formData, section_order: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                    Is Core Section
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.is_core_section ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, is_core_section: e.target.value === "true" })}
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
                                Save
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
