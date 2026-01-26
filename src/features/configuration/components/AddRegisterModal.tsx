'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useAllRegister } from '../hooks/useAllRegister';
import { useFetch } from '@/shared/hooks';

interface AddRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddRegisterModal({ isOpen, onClose, onSuccess }: AddRegisterModalProps) {
    const { registers } = useAllRegister();
    const { execute: createRegister, loading: creating } = useFetch();

    const [formData, setFormData] = useState({
        register_mnemonic: '',
        register_description: '',
        master_register_id: '',
    });

    const handleSubmit = async () => {
        if (!formData.register_mnemonic) {
            alert('Register Name is required');
            return;
        }

        try {
            await createRegister('/api/configuration/registers/create', {
                method: 'POST',
                body: JSON.stringify({
                    register_mnemonic: formData.register_mnemonic,
                    register_description: formData.register_description,
                    master_register_id: formData.master_register_id || null,
                })
            });

            // Reset form
            setFormData({
                register_mnemonic: '',
                register_description: '',
                master_register_id: '',
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create register', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            register_mnemonic: '',
            register_description: '',
            master_register_id: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[800px] max-h-[600px] bg-[#F2BA1A] rounded-[20px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white relative rounded-[20px] overflow-y-hidden p-10">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Add New Register</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Register Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Register Name"
                                    value={formData.register_mnemonic}
                                    onChange={(e) => setFormData({ ...formData, register_mnemonic: e.target.value })}
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
                                value={formData.register_description}
                                onChange={(e) => setFormData({ ...formData, register_description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all resize-none text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Master Register
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.master_register_id}
                                    onChange={(e) => setFormData({ ...formData, master_register_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600"
                                >
                                    <option value="">Select Master Register</option>
                                    {registers.map((register) => (
                                        <option key={register.register_id} value={register.register_id}>
                                            {register.register_mnemonic}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-black text-white rounded-full disabled:opacity-50"
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
