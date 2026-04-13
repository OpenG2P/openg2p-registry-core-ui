'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TopBar } from '@/components/shared';
import { useAllSemanticPatterns, useIncomingSemanticPattern } from '@/features/configuration/shared';
import { usePagination, useFetch } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useTranslations } from 'next-intl';
import { IncomingSemanticPattern } from '@/features/configuration/shared/hooks/useAllSemanticPatterns';
import AddSemanticPatternModal from '@/features/configuration/ingest/AddSemanticPatternModal';
import ViewSemanticPatternModal from '@/features/configuration/ingest/ViewSemanticPatternModal';
import EditSemanticPatternModal from '@/features/configuration/ingest/EditSemanticPatternModal';
import { toast } from 'react-toastify';

const SemanticPatternsPage = () => {
    const t = useTranslations();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { config } = useRuntimeConfig();
    const { semanticPatterns, pagination, loading, refresh } = useAllSemanticPatterns(currentPage, config.pageSize);
    const { selectedSemanticPattern, fetchSemanticPattern } = useIncomingSemanticPattern();
    const { execute: deletePattern } = useFetch();

    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config.pageSize || 10,
        currentCount: semanticPatterns.length,
    });

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handleView = async (pattern: IncomingSemanticPattern) => {
        const result = await fetchSemanticPattern(pattern.semantic_pattern_id);
        if (result) {
            setIsViewModalOpen(true);
        }
    };

    const handleUpdate = async (pattern: IncomingSemanticPattern) => {
        const result = await fetchSemanticPattern(pattern.semantic_pattern_id);
        if (result) {
            setIsEditModalOpen(true);
        }
    };

    const proceedDelete = async (id: string) => {
        try {
            const result = await deletePattern('/api/configuration/ingest/delete-semantic-pattern', {
                method: 'POST',
                body: JSON.stringify({ semantic_pattern_id: id })
            });

            if (result?.semantic_pattern_id) {
                toast.success(t('toast_semantic_pattern_removed'));
                refresh();
            } else {
                toast.error(t('toast_semantic_pattern_remove_failed'));
            }
        } catch (error) {
            toast.error(t('toast_operation_failed'));
        }
    };

    const handleDelete = (pattern: IncomingSemanticPattern) => {
        const { semantic_pattern_id: id } = pattern;

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
                breadcrumb={[{ label: t('ingest_configurations') }, { label: t('semantic_patterns') }]}
                showFilters={false}
                showPagination
                showAddNewButton={true}
                addNewButtonText={t('add_new_semantic_pattern')}
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
                                {t('semantic_pattern_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('data_model_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('register')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('section')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('actions')}
                            </div>
                        </div>

                        {/* Data Rows */}
                        {semanticPatterns.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                {t('no_items_found')}
                            </div>
                        ) : (
                            semanticPatterns.map((pattern: IncomingSemanticPattern, index: number) => (
                                <div key={pattern.semantic_pattern_id} className="block -mx-8">
                                    <div
                                        className={`grid grid-cols-5 gap-4 items-center px-16 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                            }`}
                                    >
                                        <div className="text-base font-medium truncate">
                                            {pattern.semantic_pattern_id}
                                        </div>
                                        <div className="text-base font-medium truncate">
                                            {pattern.data_model_mnemonic}
                                        </div>
                                        <div className="text-base font-medium truncate">
                                            {pattern.register_mnemonic}
                                        </div>
                                        <div className="text-base font-medium truncate">
                                            {pattern.section_mnemonic}
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => handleView(pattern)}
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
                                                onClick={() => handleUpdate(pattern)}
                                                className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('update')}
                                            >
                                                <span className="text-sm font-medium">{t('update')}</span>
                                                <Image
                                                    src="/images/common/edit.png"
                                                    alt={t('update')}
                                                    width={18}
                                                    height={18}
                                                    className="ml-2"
                                                />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pattern)}
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
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <AddSemanticPatternModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={refresh}
            />

            <ViewSemanticPatternModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={selectedSemanticPattern}
            />

            <EditSemanticPatternModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={selectedSemanticPattern}
                onSuccess={refresh}
            />
        </>
    );
};

export default SemanticPatternsPage;
