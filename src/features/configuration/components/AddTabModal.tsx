import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronDown } from 'lucide-react';


interface AddTabModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddTabModal({ isOpen, onClose, onSuccess }: AddTabModalProps) {
    const [formData, setFormData] = useState({
        tabName: '',
        description: '',
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        if (onSuccess) onSuccess();
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            tabName: '',
            description: '',
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
                            <label className="block text-sm font-semibold text-black mb-2">
                                Tab Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Tab Name"
                                    value={formData.tabName}
                                    onChange={(e) => setFormData({ ...formData, tabName: e.target.value })}
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
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all resize-none text-gray-600 placeholder:text-gray-400"
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
