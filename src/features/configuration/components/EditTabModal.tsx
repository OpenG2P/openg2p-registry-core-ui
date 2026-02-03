import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { Tab } from '../types';

interface EditTabModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: Tab;
    registerId: string;
}

export default function EditTabModal({ isOpen, onClose, onSuccess, initialData, registerId }: EditTabModalProps) {
    const { execute: updateTab, loading } = useFetch();

    const [formData, setFormData] = useState({
        tab_label: '',
        tab_order: '',
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                tab_label: initialData.tab_label || '',
                tab_order: initialData.tab_order?.toString() || '0',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!formData.tab_label) {
            toast.warn('Tab Label is required');
            return;
        }

        const result = await updateTab('/api/configuration/registers/tabs/edit', {
            method: 'POST',
            body: JSON.stringify({
                tab_id: initialData?.tab_id,
                register_id: registerId,
                tab_label: formData.tab_label,
                tab_order: Number(formData.tab_order) || 0,
            })
        });

        if (result) {
            toast.success(`Tab "${formData.tab_label}" updated successfully`);
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to update tab');
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[800px] max-h-[600px] bg-[#F2BA1A] rounded-[20px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-white p-10 relative rounded-[20px] overflow-y-auto">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Edit Tab</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Tab Label
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Tab Label"
                                    value={formData.tab_label}
                                    onChange={(e) => setFormData({ ...formData, tab_label: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Tab Order
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 0"
                                value={formData.tab_order}
                                onChange={(e) => setFormData({ ...formData, tab_order: e.target.value })}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
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
