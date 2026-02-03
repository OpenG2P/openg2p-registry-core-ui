'use client';

import Image from 'next/image';
import { useState } from 'react';

interface EditRegistryProps {
    initialName: string;
    initialImage: string;
    onSave: (name: string, image: string) => void;
    onCancel: () => void;
}

export default function EditRegistry({
    initialName,
    initialImage,
    onSave,
    onCancel,
}: EditRegistryProps) {
    const [name, setName] = useState(initialName);
    const [image, setImage] = useState(initialImage);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = () => {
        document.getElementById('registry-image-upload')?.click();
    };

    return (
        <div className="bg-[#FAF4D3] rounded-[30px] p-8 border-2 border-dashed border-[#ED7C22]">
            <div className="flex items-center gap-10">
                {/* Image Edit Area */}
                <div className="relative w-[120px] h-[120px] bg-[#E5E7EB] rounded-[20px] flex items-center justify-center overflow-hidden">
                    <input
                        type="file"
                        id="registry-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <Image
                        src={image}
                        alt="Registry Logo"
                        width={120}
                        height={120}
                        className="object-contain"
                        unoptimized
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/5">
                        <button
                            className="bg-[#6B7280] text-white text-xs py-1.5 px-4 rounded-full font-medium transition-colors opacity-40 hover:opacity-100"
                            onClick={triggerUpload}
                        >
                            Upload
                        </button>
                        <button
                            className="bg-[#6B7280] text-white text-xs py-1.5 px-4 rounded-full font-medium transition-colors opacity-40 hover:opacity-100"
                            onClick={() => setImage('/config/blank_image.png')}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Input and Buttons Area */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Registry Name"
                        className="w-[234px] h-[34px] px-4 py-2.5 rounded-[5px] border-none text-gray-700 bg-[#ffff] outline-none"
                    />

                    <button
                        onClick={onCancel}
                        className="w-[70px] h-[30px] bg-white text-gray-600 rounded-full font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSave(name, image)}
                        className="w-[70px] h-[30px] bg-black text-white rounded-full font-medium flex items-center justify-center"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
