'use client';

import { useState } from 'react';
import { TopBar } from '@/components/shared';
import RegisterTabConfigView from './RegisterTabConfigView';
import { usePagination } from '@/shared/hooks/usePagination';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';

interface RegisterTabsContentProps {
    registerId: string;
}

export default function RegisterTabsContent({ registerId }: RegisterTabsContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { config } = useRuntimeConfig();
    const PAGE_SIZE = config.pageSize || 10;
    const [paginationInfo, setPaginationInfo] = useState({ totalItems: 0, currentCount: 0 });

    const pagination = usePagination({
        currentPage,
        pageSize: PAGE_SIZE,
        totalItems: paginationInfo.totalItems,
        currentCount: paginationInfo.currentCount,
    });

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    };

    return (
        <>
            <TopBar
                breadcrumb={[]}
                showFilters={false}
                showPagination={true}
                showAddNewButton={true}
                addNewButtonText={"Add New Tab"}
                onAddNewButton={() => setIsModalOpen(true)}
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <RegisterTabConfigView
                onAddNewRegister={() => setIsModalOpen(true)}
                isModalOpen={isModalOpen}
                onCloseModal={() => setIsModalOpen(false)}
                page={currentPage}
                pageSize={PAGE_SIZE}
                onDataLoaded={(totalItems, currentCount) => setPaginationInfo({ totalItems, currentCount })}
            />
        </>
    );
}
