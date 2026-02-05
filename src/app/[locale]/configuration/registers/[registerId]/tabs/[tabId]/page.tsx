'use client';

import { useState } from 'react';
import { TopBar, BreadcrumbBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import RegisterSectionConfigView from '@/features/configuration/components/RegisterSectionConfigView';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import EditTabModal from '@/features/configuration/components/EditTabModal';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import { useConfigTabs } from '@/features/configuration/hooks/useConfigTabs';

import { usePagination } from '@/shared/hooks/usePagination';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { getRegisterDetails, getTabDetails } from '@/features/configuration/utils/configUtils';

const TabConfigurationPage = () => {
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { config } = useRuntimeConfig();
    const PAGE_SIZE = config.pageSize || 10;
    const [paginationInfo, setPaginationInfo] = useState({ totalItems: 0, currentCount: 0 });

    const { registers, loading: registersLoading } = useAllRegister(1, 100);
    const { tabs, loading: tabsLoading, refresh: refreshTabs } = useConfigTabs(registerId, 1, 100);

    const pagination = usePagination({
        currentPage,
        pageSize: PAGE_SIZE,
        totalItems: paginationInfo.totalItems,
        currentCount: paginationInfo.currentCount,
    });

    const registerDetails = getRegisterDetails(registerId, registers);
    const tabDetails = getTabDetails(tabId, tabs);

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            { label: registerDetails.register_mnemonic || '', href: `/configuration/registers/${registerId}` },
            { label: tabDetails.tab_label || '', href: `/configuration/registers/${registerId}/tabs/${tabId}` }
        ]
    });

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    };

    if (registersLoading || tabsLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED7C22]"></div>
            </div>
        );
    }




    return (
        <>
            <div className="pt-10 px-7.5 mb-6">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <ConfigDetailsSummary
                title={tabDetails.tab_label || 'None'}
                extraInfo1={registerDetails.register_mnemonic || 'None'}
                extraInfo2={String(tabDetails.tab_order ?? 0)}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <TopBar
                breadcrumb={[]}
                showFilters={false}
                showPagination={true}
                showAddNewButton={true}
                addNewButtonText={"Add New Section"}
                onAddNewButton={() => setIsModalOpen(true)}
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <RegisterSectionConfigView
                isModalOpen={isModalOpen}
                onCloseModal={() => setIsModalOpen(false)}
                page={currentPage}
                pageSize={PAGE_SIZE}
                onDataLoaded={(totalItems, currentCount) => setPaginationInfo({ totalItems, currentCount })}
            />

            <EditTabModal
                isOpen={isEditModalOpen}
                initialData={tabDetails as any}
                registerId={registerId}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refreshTabs}
            />
        </>
    );
};


export default TabConfigurationPage;
