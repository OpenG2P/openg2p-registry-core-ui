'use client';

import Image from 'next/image';
import { useState } from 'react';
import { TopBar } from '@/components/shared';
import { useFetch, usePagination } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useRbac } from '@/context/RbacContext';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import Can from '@/components/shared/Can';
import { toast } from 'react-toastify';
import { CONFIGURATION_OUTGESTION_TOPICS_ACTIONS } from '@/features/configuration/shared/utils/configurationOutgestionTopics.actions';
import AddOutgestionTopicModal from '@/features/configuration/outgest/AddOutgestionTopicModal';
import EditOutgestionTopicModal from '@/features/configuration/outgest/EditOutgestionTopicModal';
import ConfirmRemovePopup from '@/features/configuration/shared/components/ConfirmRemovePopup';
import ViewOutgestionTopicModal from '@/features/configuration/outgest/ViewOutgestionTopicModal';
import { useAllOutgestTopics } from '@/features/configuration/shared/hooks/useAllOutgestTopics';

export interface OutgestTopic {
    topic_id: string;
    register_id: string;
    register_mnemonic: string;
    data_model_id: string;
    data_model_mnemonic: string;
    websub_topic: string;
    description: string;
    is_active: boolean;
    websub_register_status: string;
    websub_register_datetime: string;
    websub_register_number_of_attempts: string;
    websub_register_latest_error_message: string;
}


const OutgestTopicsPage = () => {
    const t = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<OutgestTopic | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const { execute: deleteOutgestionTopic } = useFetch();
    const { execute: toggleTopicStatus } = useFetch();

    const proceedDelete = async (id: string) => {
        try {
            const result = await deleteOutgestionTopic('/api/configuration/outgest/delete-topic', {
                method: 'POST',
                body: JSON.stringify({ topic_id: id })
            });

            if (result) {
                toast.success(t("topic_deleted_success"));
                refresh();
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error');
        }
    };

    const handleToggleStatus = async (
        e: React.MouseEvent<HTMLButtonElement>,
        item: OutgestTopic
    ) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await toggleTopicStatus(
                '/api/configuration/outgest/toggle-topic-status',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        topic_id: item.topic_id,
                    }),
                }
            );

            if (result) {
                toast.success(
                    item.is_active
                        ? t('topic_deactivated')
                        : t('topic_activated')
                );
                refresh();
            } else {
                toast.error(t('update_failed'));
            }
        } catch (error) {
            toast.error(t('update_failed'));
        }
    };

    const handleDelete = (
        e: React.MouseEvent<HTMLButtonElement>,
        item: OutgestTopic
    ) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedItem(item);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;

        const { topic_id } = selectedItem;

        await proceedDelete(topic_id);

        setShowPopup(false);
        setSelectedItem(null);
    };

    const { config } = useRuntimeConfig();

    const { can } = useRbac();
    const canCreate = can(CONFIGURATION_OUTGESTION_TOPICS_ACTIONS.create)

    const { topics, pagination, loading, refresh } = useAllOutgestTopics(currentPage, config.pageSize);


    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config.pageSize || 10,
        currentCount: topics.length,
    });


    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1);
    };

    return (
        <>
            <TopBar
                breadcrumb={[{ label: t('outgest_configurations') }, { label: t('outgest_topics') }]}
                showFilters={false}
                showPagination
                showAddNewButton={canCreate}
                addNewButtonText={t('add_new_outgestion_topic')}
                onAddNewButton={() => setIsModalOpen(true)}
                pageStart={pageStart}
                pageEnd={pageEnd}
                total={total}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <div className="mx-7.5 bg-white rounded-[10px] p-4 pt-8 overflow-hidden">
                <div>
                    <div className="grid grid-cols-5 gap-4 pb-2 px-8 border-b border-gray-100">
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('topic_id')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('register_mnemonic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('data_model_mnemonic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('websub_topic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('actions')}
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-60">
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src="/images/common/loading.gif"
                                    alt="Loading"
                                    className="w-12 h-12"
                                />
                            </div>
                        </div>
                    ) : (
                        topics.map((item, index) => (
                            <div
                                key={item.topic_id}
                                className={`grid grid-cols-5 gap-4 items-center -mx-8 px-16 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'} cursor-pointer`}
                            >
                                <div className="text-base font-medium truncate">
                                    {item.topic_id}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.register_mnemonic}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.data_model_mnemonic}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.websub_topic}
                                </div>


                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedItem(item);
                                            setIsViewOpen(true);
                                        }}
                                        className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                        title={t('view')}
                                    >
                                        <span className="text-sm font-medium">{t('view')}</span>
                                        <Image
                                            src="/images/common/view.png"
                                            alt={t('view')}
                                            width={18}
                                            height={18}
                                            className="ml-2"
                                        />
                                    </button>
                                    <Can action={CONFIGURATION_OUTGESTION_TOPICS_ACTIONS.edit}>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedItem(item);
                                                setIsEditOpen(true);
                                            }}
                                            className="flex items-center text-black cursor-pointer gap-2 hover:opacity-80 transition-opacity"
                                            title={t('common.edit')}
                                        >
                                            <span className="font-medium text-[#00000080]">{t('common.edit')}</span>
                                            <Pencil size={16} className='opacity-60' />
                                        </button>
                                    </Can>
                                    <Can action={CONFIGURATION_OUTGESTION_TOPICS_ACTIONS.delete}>
                                        {item.is_active ? (
                                            <button
                                                onClick={(e) => handleToggleStatus(e, item)}
                                                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('deactivate')}
                                            >
                                                <span className="font-medium text-[#00000080]">
                                                    {t('deactivate')}
                                                </span>
                                                <Image
                                                    src="/images/common/false_sign.png"
                                                    alt={t('deactivate')}
                                                    width={18}
                                                    height={18}
                                                    className="ml-2"
                                                />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => handleDelete(e, item)}
                                                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('remove')}
                                            >
                                                <span className="font-medium text-[#00000080]">
                                                    {t('remove')}
                                                </span>
                                                <Image
                                                    src="/images/common/false_sign.png"
                                                    alt={t('remove')}
                                                    width={18}
                                                    height={18}
                                                    className="ml-2"
                                                />
                                            </button>
                                        )}
                                    </Can>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showPopup && (
                <ConfirmRemovePopup
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedItem(null);
                    }}
                    onConfirm={confirmDelete}
                    messageKey='confirm_remove_outgestion_topic'
                />
            )}

            <ViewOutgestionTopicModal
                isOpen={isViewOpen}
                data={selectedItem}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedItem(null);
                }}
            />

            <AddOutgestionTopicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    refresh();
                }}
            />
            <EditOutgestionTopicModal
                isOpen={isEditOpen}
                data={selectedItem}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedItem(null);
                }}
                onSuccess={() => {
                    refresh();
                }}
            />
        </>
    );
};

export default OutgestTopicsPage;
