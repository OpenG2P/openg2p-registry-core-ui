import { useState } from 'react';
import { X } from 'lucide-react';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface AddTabModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddTabModal({ isOpen, onClose, onSuccess }: AddTabModalProps) {
    const { registerId } = useParams<{ registerId: string }>();
    const { execute: createTab, loading } = useFetch();

    const [formData, setFormData] = useState({
        tabName: '',
        tabOrder: '',
    });

    const handleSubmit = async () => {
        if (!formData.tabName) {
            toast.warn('Tab Name is required');
            return;
        }

        const result = await createTab('/api/configuration/registers/tabs/create', {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                tab_label: formData.tabName,
                tab_order: Number(formData.tabOrder) || 0,
            })
        });

        if (result?.tab_id) {
            toast.success('Tab created successfully');
            setFormData({ tabName: '', tabOrder: '' });
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create tab');
        }
    };

    const handleCancel = () => {
        setFormData({
            tabName: '',
            tabOrder: '',
        });
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80  z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[800px] max-h-[600px] bg-[#F2BA1A] rounded-[20px] overflow-hidden flex p-1">

                <div className="flex-1 w-full bg-white relative rounded-[20px] overflow-y-hidden p-10">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Add New Tab</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">
                                Tab Name
                            </label>
                            <p className="text-[15px] text-gray-400 mb-2 italic">
                                * Use lowercase and underscores only (e.g., test_tab)
                            </p>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. test_tab"
                                    value={formData.tabName}
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                        setFormData({ ...formData, tabName: value });
                                    }}
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
                                placeholder="e.g. 0, 1, 2, etc."
                                value={formData.tabOrder}
                                onChange={(e) => setFormData({ ...formData, tabOrder: e.target.value })}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all text-gray-600 placeholder:text-gray-400"
                            />
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
                                className="px-12 py-2.5 bg-black text-white rounded-full"
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
