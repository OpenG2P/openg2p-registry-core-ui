import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';


interface EditSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        sectionName: string;
        description: string;
    };
}

export default function EditSectionModal({ isOpen, onClose, initialData }: EditSectionModalProps) {
    const [formData, setFormData] = useState({
        sectionName: '',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                sectionName: initialData.sectionName,
                description: initialData.description,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = () => {
        console.log('Form updated:', formData);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80  z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[800px] max-h-[600px] bg-[#F2BA1A] rounded-[20px] overflow-hidden flex p-1">

                <div className="flex-1 w-full bg-white  p-10 relative  rounded-[20px] overflow-y-hidden">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Edit Section</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Section Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Section Name"
                                    value={formData.sectionName}
                                    onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
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
                                Update
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
