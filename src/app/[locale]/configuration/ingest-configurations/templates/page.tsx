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
import ConfirmRemovePopup from '@/features/configuration/shared/components/ConfirmRemovePopup';
import { CONFIGURATION_INGESTION_TEMPLATES_ACTIONS } from '@/features/configuration/shared/utils/configurationIngestionTemplates.actions';
import { useAllIngestTemplates } from '@/features/configuration/shared/hooks/useAllIngestTemplates';
import ViewIngestionTemplateModal from '@/features/configuration/ingest/ViewIngestionTemplateModal';
import AddIngestionTemplateModal from '@/features/configuration/ingest/AddIngestionTemplateModal';
import EditIngestionTemplateModal from '@/features/configuration/ingest/EditIngestionTemplateModal';

type IngestTemplate = {
    template_id: string;
    register_id: string;
    register_mnemonic: string;
    data_model_id: string;
    data_model_mnemonic: string;
    template_file_id: string;
    jsonld_expansion_required: boolean;
}


const IngestTemplatesPage = () => {
    const t = useTranslations();
    const [currentPage, setCurrentPage] = useState(1);

    const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | null>(null);
    const [selectedItem, setSelectedItem] = useState<IngestTemplate | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const { execute: deleteIngestionTemplate } = useFetch();

    const proceedDelete = async (id: string) => {
        try {
            const result = await deleteIngestionTemplate('/api/configuration/ingest/delete-template', {
                method: 'POST',
                body: JSON.stringify({ template_id: id })
            });

            if (result) {
                toast.success(t("template_deleted_success"));
                refresh();
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error');
        }
    };

    const handleDelete = (
        e: React.MouseEvent<HTMLButtonElement>,
        item: IngestTemplate
    ) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedItem(item);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;

        const { template_id } = selectedItem;

        await proceedDelete(template_id);

        setShowPopup(false);
        setSelectedItem(null);
    };

    const { config } = useRuntimeConfig();

    const { can } = useRbac();
    const canCreate = can(CONFIGURATION_INGESTION_TEMPLATES_ACTIONS.create)

    const { templates, pagination, loading, refresh } = useAllIngestTemplates(currentPage, config.pageSize);


    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config.pageSize || 10,
        currentCount: templates.length,
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
                breadcrumb={[{ label: t('ingest_configurations') }, { label: t('ingest_templates') }]}
                showFilters={false}
                showPagination
                showAddNewButton={canCreate}
                addNewButtonText={t('add_new_ingestion_template')}
                onAddNewButton={() => setModalType('add')}
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
                            {t('template_id')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('register_mnemonic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('data_model_mnemonic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('template_file_id')}
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
                        templates.map((item, index) => (
                            <div
                                key={item.template_id}
                                className={`grid grid-cols-5 gap-4 items-center -mx-8 px-16 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'} cursor-pointer`}
                            >
                                <div className="text-base font-medium truncate">
                                    {item.template_id}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.register_mnemonic}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.data_model_mnemonic}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.template_file_id}
                                </div>


                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedItem(item);
                                            setModalType('view');
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
                                    <Can action={CONFIGURATION_INGESTION_TEMPLATES_ACTIONS.edit}>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedItem(item);
                                                setModalType('edit');
                                            }}
                                            className="flex items-center text-black cursor-pointer gap-2 hover:opacity-80 transition-opacity"
                                            title={t('common.edit')}
                                        >
                                            <span className="font-medium text-[#00000080]">{t('common.edit')}</span>
                                            <Pencil size={16} className='opacity-60' />
                                        </button>
                                    </Can>
                                    <Can action={CONFIGURATION_INGESTION_TEMPLATES_ACTIONS.delete}>
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
                    messageKey='confirm_remove_ingestion_template'
                />
            )}
            {modalType === 'view' && (
                <ViewIngestionTemplateModal
                    data={selectedItem}
                    onClose={() => {
                        setModalType(null);
                        setSelectedItem(null);
                    }}
                />
            )}

            {modalType === 'add' && (
                <AddIngestionTemplateModal
                    onClose={() => setModalType(null)}
                    onSuccess={() => {
                        refresh();
                    }}
                />
            )}

            {modalType === 'edit' && (
                <EditIngestionTemplateModal
                    data={selectedItem}
                    onClose={() => {
                        setModalType(null);
                        setSelectedItem(null);
                    }}
                    onSuccess={() => {
                        refresh();
                    }}
                />
            )}
        </>
    );
};

export default IngestTemplatesPage;
