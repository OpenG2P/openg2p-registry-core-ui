'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import AddSectionModal from './AddSectionModal';
import { Section } from '../shared/types';
import { useParams } from 'next/navigation';
import { useConfigSections } from '../shared/hooks/useConfigSections';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';
import Can from '@/components/shared/Can';
import { CONFIGURATION_SECTIONS_ACTIONS } from '../shared/utils/configurationSections.actions';
import ConfirmRemovePopup from '../shared/components/ConfirmRemovePopup';

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
    const t = useTranslations();
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const { sections, loading, refresh, pagination } = useConfigSections(registerId, tabId, page, pageSize);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

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
            toast.success(t('toast_section_removed'));
            refresh();
        } else {
            toast.error(t('toast_section_remove_failed'));
        }
    };

    const handleDelete = (e: React.MouseEvent, sectionId: string) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedSectionId(sectionId);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        if (!selectedSectionId) return;

        await proceedDelete(selectedSectionId);

        setShowPopup(false);
        setSelectedSectionId(null);
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
                    <div className="grid grid-cols-5 gap-4 pb-2 px-4">
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('section_name')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('section_order')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('is_core')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('is_primary')}
                        </div>

                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('actions')}
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
                                className={`grid grid-cols-5 gap-4 items-center h-15 px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                    } cursor-pointer`}
                            >
                                <div className="text-base font-medium">
                                    {section.section_mnemonic}
                                </div>
                                <div className="text-base font-medium text-gray-500">
                                    {section.section_order}
                                </div>
                                <div className="text-base font-medium text-gray-500">
                                    {section.is_core_section ? 'True' : 'False'}
                                </div>
                                <div className="text-base font-medium text-gray-500">
                                    {section.is_primary_section ? 'True' : 'False'}
                                </div>

                                <div className="text-base font-medium">
                                    <Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
                                        <span
                                            onClick={(e) => handleDelete(e, section.section_id)}
                                            className="flex items-center text-[#00000080]"
                                        >
                                            {t('remove')}
                                            <Image
                                                src="/images/common/false_sign.png"
                                                alt={t('remove')}
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

            {showPopup && (
                <ConfirmRemovePopup
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedSectionId(null);
                    }}
                    onConfirm={confirmDelete}
                    messageKey="confirm_remove_section"
                />
            )}

            {isModalOpen && (
                <AddSectionModal
                    onClose={onCloseModal}
                    onSuccess={refresh}
                />
            )}
        </>
    );
}
