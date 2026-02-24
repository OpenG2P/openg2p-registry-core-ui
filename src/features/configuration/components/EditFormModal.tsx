'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { Tab } from '../types';

interface EditFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: Tab;
    registerId: string;
}

export default function EditFormModal({ isOpen, onClose, onSuccess, initialData, registerId }: EditFormModalProps) {
    const { execute: updateForm, loading } = useFetch();
    const [formData, setFormData] = useState({
        tab_label: '',
        tab_order: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                tab_label: initialData.tab_label || '',
                tab_order: initialData.tab_order || 0,
            });
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (!formData.tab_label) {
            toast.warn('Form Label is required');
            return;
        }

        const result = await updateForm('/api/configuration/registers/tabs/edit', {
            method: 'POST',
            body: JSON.stringify({
                tab_id: initialData.tab_id,
                register_id: registerId,
                tab_label: formData.tab_label,
                tab_order: Number(formData.tab_order),
            })
        });

        if (result) {
            toast.success('Form updated successfully');
            onSuccess();
            onClose();
        } else {
            toast.error('Failed to update form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 bg-[#F2BA1A] rounded-[10px] p-1">
                <div className="bg-white rounded-[10px] p-10 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <X size={40} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-6">Edit Form</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">Form Label</label>
                            <input
                                type="text"
                                value={formData.tab_label}
                                onChange={(e) => setFormData({ ...formData, tab_label: e.target.value })}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">Form Order</label>
                            <input
                                type="number"
                                value={formData.tab_order}
                                onChange={(e) => setFormData({ ...formData, tab_order: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button onClick={onClose} className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-[10px]">Cancel</button>
                            <button onClick={handleSubmit} disabled={loading} className="px-12 py-2.5 bg-black text-white rounded-[10px]">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
