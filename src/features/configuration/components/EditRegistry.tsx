'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageCropper from '@/components/shared/ImageCropper';

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
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppingImage(reader.result as string);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        setImage(croppedImage);
        setIsCropperOpen(false);
        setCroppingImage(null);
    };

    const handleCropCancel = () => {
        setIsCropperOpen(false);
        setCroppingImage(null);
    };

    const triggerUpload = () => {
        document.getElementById('registry-image-upload')?.click();
    };

    return (
        <>
            <div className="bg-[#F2BA1A]/20 rounded-[30px] p-10 border-2 border-dashed border-[#ED7C22] w-full min-h-[300px] flex flex-col justify-between font-roboto">
                <div className="flex flex-col gap-10">
                    {/* Top Section */}
                    <div className="flex items-center gap-10">
                        {/* Image Edit Area */}
                        <div className="relative group w-[120px] h-[120px] bg-[#E5E7EB] rounded-[10px] flex items-center justify-center overflow-hidden shrink-0">
                            <input
                                type="file"
                                id="registry-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {image && image !== '/config/blank_image.png' ? (
                                <Image
                                    src={image}
                                    alt="Registry Logo"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon size={50} strokeWidth={1} />
                                </div>
                            )}

                            {/* Overlay Action Buttons */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={triggerUpload}
                                    className="flex items-center justify-center gap-2 w-[95px] py-1.5 bg-white rounded-full text-[#ED7C22] shadow-md hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    <Upload size={15} strokeWidth={2.5} />
                                    <span className="text-[13px] leading-none">Upload</span>
                                </button>
                                <button
                                    onClick={() => setImage('/config/blank_image.png')}
                                    className="flex items-center justify-center gap-2 w-[95px] py-1.5 bg-white rounded-full text-[#ED7C22] shadow-md hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    <Trash2 size={15} strokeWidth={2.5} />
                                    <span className="text-[13px] leading-none">Remove</span>
                                </button>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="flex-1 flex items-center gap-4">
                            <div className="w-[300px]">
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-black text-[16px] font-normal leading-[22px] tracking-normal m-0'>Registry Name</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Registry Name"
                                        className="w-full h-[40px] px-4 rounded-[10px] border-none text-[16px] font-medium text-black/50 bg-white outline-none placeholder:text-black/50"
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider and Bottom Section */}
                    <div className="space-y-6">
                        {/* Divider */}
                        <div className="w-full h-[1px] bg-[#F2BA1A]" />

                        {/* Buttons Row */}
                        <div className="flex gap-4">
                            <button
                                onClick={onCancel}
                                className="w-[80px] h-[40px] bg-[#DDDDDD] text-black/50 rounded-[20px] text-[16px] font-medium hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onSave(name, image)}
                                className="w-[80px] h-[40px] bg-black text-white rounded-[20px] text-[16px] font-medium hover:bg-black/90 transition-colors flex items-center justify-center"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isCropperOpen && croppingImage && (
                <ImageCropper
                    image={croppingImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </>
    );
}
