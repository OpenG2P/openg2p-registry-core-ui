'use client';

import { Upload } from 'lucide-react';

interface Props {
    label: string;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    uploading: boolean;
    fileId?: string;
    fileName?: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export default function FileUploadField({
    label,
    fileInputRef,
    uploading,
    fileId,
    fileName,
    onFileChange,
    disabled,
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
                            : fileId
                                ? 'Change File'
                                : 'Upload File'}
                    </button>

                    {fileId && (
                        <p className="text-[#77D79B] mt-1 text-xs">
                            {fileName}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}