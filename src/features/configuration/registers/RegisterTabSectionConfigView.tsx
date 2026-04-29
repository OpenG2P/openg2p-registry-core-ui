'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useConfigSections } from '../shared/hooks/useConfigSections';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';
import Can from '@/components/shared/Can';
import { CONFIGURATION_SECTIONS_ACTIONS } from '../shared/utils/configurationSections.actions';
import AddTabSectionModal from './AddTabSectionModal';
import EditTabSectionModal from './EditTabSectionModal';
import EditButton from '../shared/components/EditButton';
import { Pencil } from 'lucide-react';

interface RegisterTabSectionConfigViewProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    page?: number;
    pageSize?: number;
    onDataLoaded?: (totalItems: number, currentCount: number) => void;
}

export default function RegisterTabSectionConfigView({
    isModalOpen,
    onCloseModal,
    page = 1,
    pageSize = 10,
    onDataLoaded,
}: RegisterTabSectionConfigViewProps) {
    const t = useTranslations();
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const { sections, loading, refresh, pagination } = useConfigSections(tabId, page, pageSize);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any>(null);

    const handleEdit = (e: React.MouseEvent, section: any) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedSection(section);
        setEditModalOpen(true);
    };

    useEffect(() => {
        if (pagination && onDataLoaded) {
            onDataLoaded(pagination.number_of_items, sections.length);
        }
    }, [pagination, sections.length, onDataLoaded]);

    const { execute: deleteSection } = useFetch();


    const proceedDelete = async (tab_section_id: string) => {
        const result = await deleteSection('/api/configuration/registers/tab-metadata/remove-section', {
            method: 'POST',
            body: JSON.stringify({ tab_section_id: tab_section_id })
        });

        if (result) {
            toast.success(t('toast_section_removed'));
            refresh();
        } else {
            toast.error(t('toast_section_remove_failed'));
        }
    };

    const handleDelete = (e: React.MouseEvent, section: any) => {
        e.preventDefault();
        e.stopPropagation();

        const tab_section_id = section.tab_section_id;
        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-neutral-first mb-3">{t('confirm_remove_section')}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(tab_section_id);
                            }}
                            className="bg-primary-second text-neutral-second px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-second transition-colors shadow-sm"
                        >
                            {t('remove')}
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-secondary-first text-neutral-first/70 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-secondary-second transition-colors"
                        >
                            {t('cancel')}
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
                className: 'rounded-[15px] shadow-xl border border-secondary-first',
            }
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-neutral-second rounded-[10px] mx-7.5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-second"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-7.5 bg-neutral-second rounded-[10px] p-8 overflow-x-visible">
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-4 pb-2 px-4">
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider truncate">
                            {t('section_id')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('section_order')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('actions')}
                        </div>

                    </div>

                    {/* Data Rows */}
                    {sections.map((section, index) => (

                        <div
                            key={section.tab_section_id}
                            className={`grid grid-cols-5 gap-4 items-center h-15 px-12 -mx-8 py-4 transition-colors ${index % 2 === 0 ? 'bg-secondary-second/25' : 'bg-neutral-second'} cursor-pointer`}
                        >
                            <div className="text-base font-medium truncate">
                                {section.section_id}
                            </div>
                            <div className="text-base font-medium text-neutral-first/50">
                                {section.section_order}
                            </div>

                            <div className="flex gap-4">
                                <Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
                                    <span
                                        onClick={(e) => handleEdit(e, section)}
                                        className="flex gap-2 items-center text-neutral-first/50 cursor-pointer"
                                    >
                                        {t('edit')}
                                        <Pencil size={16} className="opacity-60" />
                                    </span>
                                </Can>
                                <Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
                                    <span
                                        onClick={(e) => handleDelete(e, section)}
                                        className="flex items-center text-neutral-first/50"
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
                    ))}
                </div>
            </div>

            <AddTabSectionModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSuccess={refresh}
            />
            <EditTabSectionModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSuccess={refresh}
                initialData={selectedSection}
            />
        </>
    );
}
