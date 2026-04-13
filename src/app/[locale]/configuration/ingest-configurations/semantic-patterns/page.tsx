'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TopBar } from '@/components/shared';
import { useSemanticPatterns } from '@/features/configuration/shared';
import { usePagination, useFetch } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useTranslations } from 'next-intl';
import { IncomingSemanticPattern } from '@/features/configuration/shared/hooks/useSemanticPatterns';
import AddSemanticPatternModal from '@/features/configuration/ingest/AddSemanticPatternModal';
import ViewSemanticPatternModal from '@/features/configuration/ingest/ViewSemanticPatternModal';
import { toast } from 'react-toastify';

const SemanticPatternsPage = () => {
    const t = useTranslations();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState<IncomingSemanticPattern | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    const { config } = useRuntimeConfig();
    const { semanticPatterns, pagination, loading, refresh } = useSemanticPatterns(currentPage, config.pageSize);

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

    const handleView = (pattern: IncomingSemanticPattern) => {
        setViewData(pattern);
        setIsViewModalOpen(true);
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
                                {t('register_id')}
                            </div>
                            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                                {t('section_id')}
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
                                <div
                                    key={pattern.semantic_pattern_id}
                                    className={`grid grid-cols-5 gap-4 items-center px-8 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                        }`}
                                >
                                    <div className="text-base font-medium truncate">
                                        {pattern.semantic_pattern_id}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {pattern.data_model_id}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {pattern.register_id}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {pattern.section_id || '-'}
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
                data={viewData}
            />
        </>
    );
};

export default SemanticPatternsPage;
