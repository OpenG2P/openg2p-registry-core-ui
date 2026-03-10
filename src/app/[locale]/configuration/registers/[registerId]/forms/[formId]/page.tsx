'use client';

import { useState } from 'react';
import { TopBar, BreadcrumbBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import {
    ConfigDetailsSummary,
    useAllRegister,
    useConfigTabs,
    getRegisterDetails,
    getTabDetails
} from '@/features/configuration/shared';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { usePagination } from '@/shared/hooks/usePagination';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { ProgramApplicationConfigView, EditFormModal } from '@/features/configuration/program-applications';

const PARegisterFormConfigurationPage = () => {
    const { registerId, formId } = useParams<{ registerId: string; formId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { config } = useRuntimeConfig();
    const PAGE_SIZE = config.pageSize || 10;
    const [paginationInfo, setPaginationInfo] = useState({ totalItems: 0, currentCount: 0 });

    const { registers, loading: registersLoading } = useAllRegister(1, 100);
    // TODO: Need to change form and tab things if both store in different tables
    const { tabs: forms, loading: formsLoading, refresh: refreshForms } = useConfigTabs(registerId, 1, 100);

    const pagination = usePagination({
        currentPage,
        pageSize: PAGE_SIZE,
        totalItems: paginationInfo.totalItems,
        currentCount: paginationInfo.currentCount,
    });

    const registerDetails = getRegisterDetails(registerId, registers);
    //TODO: Need to change if different table for tab and forms
    const formDetails = getTabDetails(formId, forms);

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            { label: registerDetails.register_mnemonic || '', href: `/configuration/registers/${registerId}` },
            { label: formDetails.tab_label || '', href: `/configuration/registers/${registerId}/forms/${formId}` }
        ]
    });

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    };

    if (registersLoading || formsLoading) {
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
                title={formDetails.tab_label || 'None'}
                extraInfo1={registerDetails.register_mnemonic || 'None'}
                extraInfo2={String(formDetails.tab_order ?? 0)}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <TopBar
                breadcrumb={[]}
                showFilters={false}
                showPagination={true}
                showSubHeading
                subHeading={`Manage sections for ${formDetails.tab_label}`}
                showAddNewButton={true}
                addNewButtonText="Add New Section"
                onAddNewButton={() => setIsModalOpen(true)}
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={handlePrev}
                onNext={handleNext}
            />
            {/* program application register section configuration view */}
            <ProgramApplicationConfigView
                isModalOpen={isModalOpen}
                onCloseModal={() => setIsModalOpen(false)}
                page={currentPage}
                pageSize={PAGE_SIZE}
                onDataLoaded={(totalItems, currentCount) => setPaginationInfo({ totalItems, currentCount })}
            />

            <EditFormModal
                isOpen={isEditModalOpen}
                initialData={formDetails as any}
                registerId={registerId}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refreshForms}
            />
        </>
    );
};

export default PARegisterFormConfigurationPage;
