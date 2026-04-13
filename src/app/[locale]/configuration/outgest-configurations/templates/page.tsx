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
import { useAllOutgestTemplates } from '@/features/configuration/shared/hooks/useAllOutgestTemplates';
import { CONFIGURATION_OUTGESTION_TEMPLATES_ACTIONS } from '@/features/configuration/shared/utils/configurationOutgestionTemplates.actions';
import EditOutgestionTemplateModal from '@/features/configuration/outgestion-config/EditOutgestionTemplateModal';
import AddOutgestionTemplateModal from '@/features/configuration/outgestion-config/AddOutgestionTemplateModal';
import ConfirmRemovePopup from '@/features/configuration/shared/components/ConfirmRemovePopup';

type OutgestTemplate = {
    template_id: string;
    register_id: string;
    data_model_id: string;
    template_file_id: string;
}


const OutgestTemplatesPage = () => {
    const t = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<OutgestTemplate | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const { execute: deleteOutgestionTemplate } = useFetch();

    const proceedDelete = async (id: string) => {
        try {
            const result = await deleteOutgestionTemplate('/api/configuration/outgestion-template/delete', {
                method: 'POST',
                body: JSON.stringify({ template_id: id })
            });

            if (result) {
                toast.success(`Template deleted successfully`);
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
        item: OutgestTemplate
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
    const canCreate = can(CONFIGURATION_OUTGESTION_TEMPLATES_ACTIONS.create)

    const { templates, pagination, loading, refresh } = useAllOutgestTemplates(currentPage, config.pageSize);


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
                breadcrumb={[{ label: t('outgest_templates') }]}
                showFilters={false}
                showPagination
                showAddNewButton={canCreate}
                addNewButtonText={t('add_new_outgestion_template')}
                onAddNewButton={() => setIsModalOpen(true)}
            // pageStart={pageStart}
            // pageEnd={pageEnd}
            // total={total}
            // onPrev={handlePrev}
            // onNext={handleNext}
            />

            <div className="mx-7.5 bg-white rounded-[10px] p-4 pt-8 overflow-hidden">
                <div>
                    <div className="grid grid-cols-5 gap-4 pb-2 px-8 border-b border-gray-100">
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('template_id')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('register_id')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('data_model_id')}
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
                                    {item.register_id}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.data_model_id}
                                </div>

                                <div className="text-base font-medium truncate">
                                    {item.template_file_id}
                                </div>


                                <div className="flex items-center gap-6">
                                    <Can action={CONFIGURATION_OUTGESTION_TEMPLATES_ACTIONS.edit}>
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
                                    <Can action={CONFIGURATION_OUTGESTION_TEMPLATES_ACTIONS.delete}>
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
                    messageKey='confirm_remove_outgestion_template'
                />
            )}

            <AddOutgestionTemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    refresh();
                }}
            />
            <EditOutgestionTemplateModal
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

export default OutgestTemplatesPage;
