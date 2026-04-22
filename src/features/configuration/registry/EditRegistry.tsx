'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations();
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
            <div className="bg-primary-first/20 rounded-[10px] p-10 border-2 border-dashed border-primary-second w-full min-h-75 flex flex-col justify-between font-roboto">
                <div className="flex flex-col gap-10">
                    {/* Top Section */}
                    <div className="flex items-center gap-10">
                        {/* Image Edit Area */}
                        <div className="relative group w-30 h-30 bg-secondary-second rounded-[10px] flex items-center justify-center overflow-hidden shrink-0">
                            <input
                                type="file"
                                id="registry-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {image && image !== '/images/config/blank_image.png' ? (
                                <Image
                                    src={image}
                                    alt={t('register_logo_alt')}
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-secondary-third">
                                    <ImageIcon size={50} strokeWidth={1} />
                                </div>
                            )}

                            {/* Overlay Action Buttons */}
                            <div className="absolute inset-0 bg-neutral-first/40 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={triggerUpload}
                                    className="flex items-center justify-center gap-2 w-23.75 py-1.5 bg-neutral-second rounded-[10px] text-primary-second shadow-md hover:bg-secondary-first transition-all active:scale-95"
                                >
                                    <Upload size={15} strokeWidth={2.5} />
                                    <span className="text-[13px] leading-none">{t('upload')}</span>
                                </button>
                                <button
                                    onClick={() => setImage('/images/config/blank_image.png')}
                                    className="flex items-center justify-center gap-2 w-23.75 py-1.5 bg-neutral-second rounded-[10px] text-primary-second shadow-md hover:bg-secondary-first transition-all active:scale-95"
                                >
                                    <Trash2 size={15} strokeWidth={2.5} />
                                    <span className="text-[13px] leading-none">{t('remove')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="flex-1 flex items-center gap-4">
                            <div className="w-75">
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-neutral-first text-[16px] font-normal leading-5.5 tracking-normal m-0'>{t('registry_name')}</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('registry_name')}
                                        className="w-full h-10 px-4 rounded-[10px] border-none text-[16px] font-medium text-neutral-first/50 bg-neutral-second outline-none placeholder:text-neutral-first/50"
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider and Bottom Section */}
                    <div className="space-y-6">
                        {/* Divider */}
                        <div className="w-full h-px bg-primary-first" />

                        {/* Buttons Row */}
                        <div className="flex gap-4">
                            <button
                                onClick={onCancel}
                                className="w-20 h-10 bg-secondary-second text-neutral-first/50 rounded-[10px] text-[16px] font-medium hover:bg-secondary-third transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={() => onSave(name, image)}
                                className="w-20 h-10 bg-neutral-first text-neutral-second rounded-[10px] text-[16px] font-medium hover:bg-neutral-first/90 transition-colors flex items-center justify-center"
                            >
                                {t('save')}
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
