'use client';

import { Upload, X } from 'lucide-react';

interface Props {
    label: string;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    uploading: boolean;
    fileId?: string;
    fileName?: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    onRemove?: () => void;
}

export default function FileUploadField({
    label,
    fileInputRef,
    uploading,
    fileId,
    fileName,
    onFileChange,
    disabled,
    onRemove
}: Props) {
    return (
        <div>
            <label className="text-[16px] font-medium text-black">
                {label}
            </label>

            <div className="mt-2 flex items-center gap-4">
                <div
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`w-10 h-10 border-2 border-dashed border-[#F77F57] rounded-[10px] flex items-center justify-center shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-orange-50'}`}
                >
                    <Upload className="text-[#F77F57]" size={20} />
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                    disabled={disabled}
                />

                <div className="flex-1">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#F77F57] font-medium disabled:opacity-50"
                    >
                        {uploading
                            ? 'Uploading...'
                            : (fileName || fileId)
                                ? 'Change File'
                                : 'Upload File'}
                    </button>

                    {fileName && (
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[#77D79B] text-[14px] truncate max-w-25">
                                {fileName}
                            </p>

                            <button
                                type="button"
                                onClick={onRemove}
                                className="text-[#EB656A] hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}