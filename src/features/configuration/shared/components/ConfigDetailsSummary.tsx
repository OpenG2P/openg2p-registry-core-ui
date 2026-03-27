import React from 'react';
import { Pencil, Eye, Check, X, ChevronDown } from 'lucide-react';
import { CONFIGURATION_REGISTERS_ACTIONS } from '../utils/configurationRegisters.actions';
import Can from '@/components/shared/Can';

interface ConfigDetailsSummaryProps {
    title: string;
    description?: string;
    extraInfo1?: string;
    extraInfo2?: string;
    onEdit?: () => void;
    onView?: () => void;
}

export default function ConfigDetailsSummary({
    title,
    description,
    extraInfo1,
    extraInfo2,
    onEdit,
    onView
}: ConfigDetailsSummaryProps) {
    const [isEditing, setIsEditing] = React.useState(false);

    return (
        <div className="mx-8 mb-0">
            <div
                className="bg-[#F3E6BC] border-[#ED7C22] border-dashed border rounded-[10px] px-12 h-15 flex items-center justify-between shadow-sm"
                style={{ borderStyle: 'dashed', borderWidth: '1px' }}
            >
                <div className="flex flex-1 items-center gap-10">
                    <div className="min-w-30">
                        <span className="text-gray-600 font-medium text-base">{title}</span>
                    </div>

                    <div className="flex-1 max-w-75 truncate">
                        <span className="text-gray-600 text-sm">{description}</span>
                    </div>

                    {extraInfo1 && (
                        <div className="flex-1 truncate">
                            <span className="text-gray-600 text-sm">{extraInfo1}</span>
                        </div>
                    )}
                    {extraInfo2 && (
                        <div className="flex-1 truncate">
                            <span className="text-gray-600 text-sm">{extraInfo2}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 ml-8">
                    {onView && (
                        <button
                            onClick={onView}
                            className="bg-white p-2 rounded-[10px] hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center shrink-0"
                            title="View Details"
                        >
                            <Eye size={16} className="text-gray-700" />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="bg-white p-2 rounded-[10px] hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center shrink-0"
                            title="Edit"
                        >
                            <Pencil size={16} className="text-gray-700" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


