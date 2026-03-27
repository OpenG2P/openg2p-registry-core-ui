'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AddSectionModal from './AddSectionModal';
import { useParams } from 'next/navigation';
import { useConfigSections } from '../shared/hooks/useConfigSections';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

import { useEffect } from 'react';
import Can from '@/components/shared/Can';
import { CONFIGURATION_SECTIONS_ACTIONS } from '../shared/utils/configurationSections.actions';

interface RegisterSectionConfigViewProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    page?: number;
    pageSize?: number;
    onDataLoaded?: (totalItems: number, currentCount: number) => void;
}

export default function RegisterSectionConfigView({
    isModalOpen,
    onCloseModal,
    page = 1,
    pageSize = 10,
    onDataLoaded,
}: RegisterSectionConfigViewProps) {
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const { sections, loading, refresh, pagination } = useConfigSections(registerId, tabId, page, pageSize);

    useEffect(() => {
        if (pagination && onDataLoaded) {
            onDataLoaded(pagination.number_of_items, sections.length);
        }
    }, [pagination, sections.length, onDataLoaded]);

    const { execute: deleteSection } = useFetch();


    const proceedDelete = async (sectionId: string) => {
        const result = await deleteSection('/api/configuration/registers/tabs/sections/delete', {
            method: 'POST',
            body: JSON.stringify({ section_id: sectionId })
        });

        if (result) {
            toast.success('Section removed successfully');
            refresh();
        } else {
            toast.error('Failed to remove section');
        }
    };

    const handleDelete = (e: React.MouseEvent, sectionId: string) => {
        e.preventDefault();
        e.stopPropagation();

        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-gray-800 mb-3">Are you sure to remove this section?</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(sectionId);
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
                            Section Name
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Description
                        </div>

                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Actions
                        </div>

                    </div>

                    {/* Data Rows */}
                    {sections.map((section, index) => (
                        <Link
                            key={section.section_id}
                            href={`/configuration/registers/${registerId}/tabs/${tabId}/sections/${section.section_id}`}
                            className="block -mx-8"
                        >
                            <div
                                className={`grid grid-cols-3 gap-4 items-center h-15 px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                    } cursor-pointer`}
                            >
                                <div className="text-base font-medium">
                                    {section.section_mnemonic}
                                </div>
                                <div className="text-base font-medium text-gray-500">
                                    {section.section_description}
                                </div>

                                <div className="text-base font-medium">
                                    <Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
                                        <span
                                            onClick={(e) => handleDelete(e, section.section_id)}
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
                                    </Can>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <AddSectionModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSuccess={refresh}
            />
        </>
    );
}
