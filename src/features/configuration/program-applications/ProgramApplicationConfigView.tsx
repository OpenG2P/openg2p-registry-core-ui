'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import AddFormModal from './AddFormModal';
import { useParams } from 'next/navigation';
import { useConfigTabs } from '../shared/hooks/useConfigTabs';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

interface ProgramApplicationConfigViewProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    page?: number;
    pageSize?: number;
    onDataLoaded?: (totalItems: number, currentCount: number) => void;
}

export default function ProgramApplicationConfigView({
    isModalOpen,
    onCloseModal,
    page = 1,
    pageSize = 10,
    onDataLoaded,
}: ProgramApplicationConfigViewProps) {
    const { registerId } = useParams<{ registerId: string }>();
    // Using the same hook as tabs for now as per previous logic, but isolated in this component
    const { tabs: forms, loading, refresh, pagination } = useConfigTabs(registerId, page, pageSize);

    // Effect to notify parent of pagination info
    useEffect(() => {
        if (pagination && onDataLoaded) {
            onDataLoaded(pagination.number_of_items, forms.length);
        }
    }, [pagination, forms.length, onDataLoaded]);


    const { execute: deleteForm } = useFetch();

    const proceedDelete = async (formId: string) => {
        const result = await deleteForm('/api/configuration/registers/tabs/delete', {
            method: 'POST',
            body: JSON.stringify({ tab_id: formId })
        });

        if (result) {
            toast.success('Form removed successfully');
            refresh();
        } else {
            toast.error('Failed to remove form');
        }
    };

    const handleDelete = (e: React.MouseEvent, formId: string) => {
        e.preventDefault();
        e.stopPropagation();

        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-gray-800 mb-3">Are you sure to remove this form?</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(formId);
                            }}
                            className="bg-[#ED7C22] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#d66a1a] transition-colors shadow-sm"
                        >
                            Remove
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'rounded-[15px] shadow-xl border border-gray-100',
            }
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-white rounded-[10px] mx-7.5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-7.5 bg-white rounded-[10px] p-8 overflow-x-visible">
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-3 gap-4 pb-2 px-4">
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Form Label
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Form Order
                        </div>

                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Actions
                        </div>

                    </div>

                    {/* Data Rows */}
                    {forms.map((form, index) => (
                        <Link
                            key={form.tab_id}
                            href={`/configuration/registers/${registerId}/forms/${form.tab_id}`}
                            className="block -mx-8"
                        >
                            <div
                                className={`grid grid-cols-3 h-15 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                    } cursor-pointer`}
                            >

                                <div className="text-base font-medium">
                                    {form.tab_label}
                                </div>
                                <div className="text-base font-medium text-gray-500">
                                    {form.tab_order}
                                </div>

                                <div className="text-base font-medium">
                                    <span
                                        onClick={(e) => handleDelete(e, form.tab_id)}
                                        className="flex items-center text-[#00000080]"
                                    >
                                        Remove
                                        <Image
                                            src="/images/common/false_sign.png"
                                            alt="Remove"
                                            width={18}
                                            height={18}
                                            className="ml-4"
                                        />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <AddFormModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSuccess={refresh}
            />
        </>
    );
}
