'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TopBar } from '@/components/shared';
import { useIncomingKeyPaths } from '@/features/configuration/shared';
import { usePagination, useFetch } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useTranslations } from 'next-intl';
import { IncomingKeyPath } from '@/features/configuration/shared/hooks/useIncomingKeyPaths';
import AddKeyPathModal from '@/features/configuration/ingest/AddKeyPathModal';
import ViewKeyPathModal from '@/features/configuration/ingest/ViewKeyPathModal';
import EditKeyPathModal from '@/features/configuration/ingest/EditKeyPathModal';
import { toast } from 'react-toastify';

const KeyPathsPage = () => {
    const t = useTranslations();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [viewData, setViewData] = useState<IncomingKeyPath | undefined>(undefined);
    const [editData, setEditData] = useState<IncomingKeyPath | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    const { config } = useRuntimeConfig();
    const { execute: deleteKeyPath } = useFetch();

    const { keyPaths, pagination, loading, refresh } = useIncomingKeyPaths(currentPage, config.pageSize);

    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config.pageSize || 10,
        currentCount: keyPaths.length,
    });

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handleView = (keyPath: IncomingKeyPath) => {
        setViewData(keyPath);
        setIsViewModalOpen(true);
    };

    const handleEdit = (keyPath: IncomingKeyPath) => {
        setEditData(keyPath);
        setIsEditModalOpen(true);
    };

    const proceedDelete = async (id: string) => {
        try {
            const result = await deleteKeyPath('/api/configuration/ingest/delete-key-path', {
                method: 'POST',
                body: JSON.stringify({ key_path_id: id })
            });

            if (result) {
                toast.success(t('toast_key_path_removed'));
                refresh();
            } else {
                toast.error(t('toast_key_path_remove_failed'));
            }
        } catch (error) {
            toast.error(t('toast_operation_failed'));
        }
    };

    const handleDelete = (keyPath: IncomingKeyPath) => {
        const { key_path_id: id } = keyPath;

        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-gray-800 mb-3">{t('are_you_sure')} ({id})</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(id);
                            }}
                            className="bg-[#ED7C22] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#d66a1a] transition-colors shadow-sm"
                        >
                            {t('remove')}
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
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
                className: 'rounded-[15px] shadow-xl border border-gray-100',
            }
        );
    };

    return (
        <>
            <TopBar
                breadcrumb={[{ label: t('ingest_configurations') }, { label: t('ingest_key_paths') }]}
                showFilters={false}
                showPagination
                showAddNewButton={true}
                addNewButtonText={t('add_new_key_path')}
                onAddNewButton={() => setIsAddModalOpen(true)}
                pageStart={pageStart}
                pageEnd={pageEnd}
                total={total}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <div className="mx-7.5 bg-white rounded-[10px] p-4 pt-8 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
                    </div>
                ) : (
                    <div>
                        {/* Header */}
                        <div className="grid grid-cols-5 gap-4 pb-2 px-8">
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('key_path_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('data_model_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('data_model_mnemonic')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('is_list')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('actions')}
                            </div>
                        </div>

                        {/* Data Rows */}
                        {keyPaths.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                {t('no_items_found')}
                            </div>
                        ) : (
                            keyPaths.map((keyPath: IncomingKeyPath, index: number) => (
                                <div
                                    key={keyPath.key_path_id}
                                    className={`grid grid-cols-5 gap-4 items-center px-8 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                        }`}
                                >
                                    <div className="text-base font-medium truncate">
                                        {keyPath.key_path_id}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {keyPath.data_model_id}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {keyPath.data_model_mnemonic}
                                    </div>
                                    <div className="text-base font-medium">
                                        {keyPath.is_list ? t('true') : t('false')}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => handleView(keyPath)}
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
                                        <button
                                            onClick={() => handleEdit(keyPath)}
                                            className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                            title={t('edit')}
                                        >
                                            <span className="text-sm font-medium">{t('edit')}</span>
                                            <Image
                                                src="/images/common/edit.png"
                                                alt={t('edit')}
                                                width={18}
                                                height={18}
                                                className="ml-2"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(keyPath)}
                                            className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                            title={t('remove')}
                                        >
                                            <span className="text-sm font-medium text-[#00000080]">{t('remove')}</span>
                                            <Image
                                                src="/images/common/false_sign.png"
                                                alt={t('remove')}
                                                width={18}
                                                height={18}
                                                className="ml-2"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <AddKeyPathModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={refresh}
            />

            <ViewKeyPathModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={viewData}
            />

            <EditKeyPathModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={editData}
                onSuccess={refresh}
            />
        </>
    );
};

export default KeyPathsPage;