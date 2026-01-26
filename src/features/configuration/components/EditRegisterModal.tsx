import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronDown } from 'lucide-react';

const MOCK_DATA = {
    parent_register: [
        "Farmer",
        "Crop",
        "Land",
        "Livestock"
    ],
    program_application: [
        "Yes",
        "No"
    ]
};

interface EditRegisterModelProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        registerName: string;
        description: string;
        parentRegister: string;
        programApplication: boolean;
    };
}

export default function EditRegisterModel({ isOpen, onClose, initialData }: EditRegisterModelProps) {
    const [formData, setFormData] = useState({
        registerName: '',
        description: '',
        parentRegister: '',
        programApplication: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                registerName: initialData.registerName,
                description: initialData.description,
                parentRegister: initialData.parentRegister,
                programApplication: initialData.programApplication ? 'Yes' : 'No'
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

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Edit Register</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Register Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Register Name"
                                    value={formData.registerName}
                                    onChange={(e) => setFormData({ ...formData, registerName: e.target.value })}
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

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Parent Register
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.parentRegister}
                                    onChange={(e) => setFormData({ ...formData, parentRegister: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600"
                                >
                                    <option value="">Select Parent Register</option>
                                    {MOCK_DATA.parent_register.map((register) => (
                                        <option key={register} value={register}>
                                            {register}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Program Application
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.programApplication}
                                    onChange={(e) => setFormData({ ...formData, programApplication: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#F77F57] rounded-lg outline-none outline-1 outline-[#F77F57] transition-all bg-white appearance-none cursor-pointer text-gray-600"
                                >
                                    <option value="">Select</option>
                                    {MOCK_DATA.program_application.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
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
