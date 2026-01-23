import React from 'react';
import Image from 'next/image';
import { Pencil, Check, X, ChevronDown } from 'lucide-react';

interface ConfigDetailsSummaryProps {
    title: string;
    description: string;
    extraInfo?: string;
    status?: boolean;
    selectionOptions?: string[];
    onSave?: (data: { title: string; description: string; extraInfo: string; status: boolean }) => void;
    onEdit?: () => void;
}

export default function ConfigDetailsSummary({
    title,
    description,
    extraInfo,
    status = true,
    selectionOptions = [],
    onSave,
    onEdit
}: ConfigDetailsSummaryProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        title,
        description,
        extraInfo: extraInfo || '',
        status
    });

    return (
        <div className="mx-8 mb-0">
            <div
                className="bg-[#F3E6BC] border-[#ED7C22] border-dashed border rounded-[30px] px-12 h-[60px] flex items-center justify-between shadow-sm"
                style={{ borderStyle: 'dashed', borderWidth: '1px' }}
            >
                <div className="flex flex-1 items-center gap-10">
                    <div className="min-w-[120px]">
                        <span className="text-gray-900 font-medium text-base">{title}</span>
                    </div>

                    <div className="flex-1 max-w-[300px] truncate">
                        <span className="text-gray-600 text-sm">{description}</span>
                    </div>

                    {extraInfo && (
                        <div className="flex-1 truncate">
                            <span className="text-gray-600 text-sm">{extraInfo}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[#1CC9B7] font-medium text-sm">{status ? 'Yes' : 'No'}</span>
                        <Image
                            src={status ? "/config/trueSign.png" : "/config/falseSign.png"}
                            alt={status ? "Success" : "Failure"}
                            width={18}
                            height={18}
                        />
                    </div>
                </div>

                <button
                    onClick={() => onEdit ? onEdit() : setIsEditing(true)}
                    className="ml-8 bg-white p-2 rounded-full hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center"
                >
                    <Pencil size={16} className="text-gray-700" />
                </button>
            </div>
        </div>
    );
}


