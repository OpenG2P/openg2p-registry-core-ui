'use client';

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
import { DataTable, DeleteButton } from '../shared/components';

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

    const handleEdit = (section: any) => {
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

    const handleDelete = (section: any) => {
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

    const columns = [
        {
            key: 'section_id',
            label: t('section_id'),
        },
        {
            key: 'section_order',
            label: t('section_order'),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={sections}
                loading={loading}
                rowKey={(item) => item.tab_section_id}
                actions={(item) => (
                    <div className="flex gap-4">
                        <Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
                            <EditButton
                                label={t('edit')}
                                onClick={() => handleEdit(item)}
                            />
                        </Can>

                        <Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
                            <DeleteButton
                                label={t('remove')}
                                onClick={() => handleDelete(item)}
                            />
                        </Can>
                    </div>
                )}
            />

            {isModalOpen && (
                <AddTabSectionModal
                    onClose={onCloseModal}
                    onSuccess={refresh}
                />
            )}
            {editModalOpen && (
                <EditTabSectionModal
                    onClose={() => setEditModalOpen(false)}
                    onSuccess={refresh}
                    initialData={selectedSection}
                />
            )}
        </>
    );
}
