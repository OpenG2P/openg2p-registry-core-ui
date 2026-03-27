'use client';

import { useState } from 'react';
import { BreadcrumbBar, TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import {
    useAllRegister,
    ConfigDetailsSummary,
    getRegisterDetails,
    ConfigurationTabs
} from '@/features/configuration/shared';
import {
    EditRegisterModal,
    ViewRegisterFieldsModal,
    RegisterTabConfigView,
    RegisterSchemaView
} from '@/features/configuration/registers';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { usePagination } from '@/shared/hooks';
import { useRbac } from '@/context/RbacContext';
import { CONFIGURATION_TABS_ACTIONS } from '@/features/configuration/shared/utils/configurationTabs.actions';
import { CONFIGURATION_REGISTERS_ACTIONS } from '@/features/configuration/shared/utils/configurationRegisters.actions';


const RegisterConfigurationPage = () => {
    const { registerId } = useParams<{ registerId: string }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'tabs' | 'filter' | 'search' | 'deduplication'>('tabs');
    const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

    const { can } = useRbac();
    const canEdit = can(CONFIGURATION_REGISTERS_ACTIONS.edit);
    const canCreate = can(CONFIGURATION_TABS_ACTIONS.create);

    const { registers, loading, refresh } = useAllRegister(1, 100);
    const registerDetails = getRegisterDetails(registerId, registers);

    const tabLabels = {
        tabs: 'Tabs',
        filter: 'Filter Schema',
        search: 'Search Schema',
        deduplication: 'Deduplication Schema',
    };

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            { label: `${registerDetails?.register_mnemonic || ''} - ${tabLabels[activeTab]}`, href: `/configuration/registers/${registerId}` }
        ]
    });

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

    if (loading || !registerDetails.register_id) {
        return (
            <div className="min-h-screen bg-[#F3F1E4] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
            </div>
        );
    }



    return (
        <>
            <div className="pt-10 px-7.5 mb-6">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <ConfigDetailsSummary
                title={registerDetails?.register_mnemonic || 'None'}
                description={registerDetails?.register_description}
                extraInfo1={registerDetails?.master_register_mnemonic || 'None'}
                extraInfo2={registerDetails.register_purpose || 'None'}
                onEdit={
                    canEdit
                        ? () => setIsEditModalOpen(true)
                        : undefined
                }
                onView={() => setIsViewModalOpen(true)}
            />

            <div className=" ml-4 mt-4 px-7.5">
                <div className="flex justify-between items-center h-14">
                    <ConfigurationTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tabLabels={tabLabels}
                    />

                    {/* TopBar */}
                    <div className="flex items-center h-full">
                        <TopBar
                            breadcrumb={[]}
                            showFilters={false}
                            showPagination={activeTab === 'tabs'}
                            showAddNewButton={activeTab === 'tabs'}
                            addNewButtonText={"Add New Tab"}
                            onAddNewButton={() => setIsModalOpen(true)}
                            showSecondaryButton={activeTab === 'tabs'}
                            secondaryButtonText="Add Intake Form"
                            onSecondaryButton={() => setIsIntakeModalOpen(true)}
                            pageStart={pagination.pageStart}
                            pageEnd={pagination.pageEnd}
                            total={pagination.total}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            showCapsule={false}
                        />
                    </div>
                </div>
            </div>


            {/* Tab Content */}
            <div className="mt-0">
                {activeTab === 'tabs' ? (
                    (
                        <RegisterTabConfigView
                            onAddNewRegister={() => setIsModalOpen(true)}
                            isModalOpen={isModalOpen}
                            onCloseModal={() => setIsModalOpen(false)}
                            isIntakeModalOpen={isIntakeModalOpen}
                            onCloseIntakeModal={() => setIsIntakeModalOpen(false)}
                            page={currentPage}
                            pageSize={PAGE_SIZE}
                            onDataLoaded={(totalItems, currentCount) => setPaginationInfo({ totalItems, currentCount })}
                        />
                    )
                ) : (
                    <RegisterSchemaView
                        registerId={registerId}
                        activeTab={activeTab as 'filter' | 'search' | 'deduplication'}
                    />
                )}
            </div>

            <EditRegisterModal
                isOpen={isEditModalOpen}
                initialData={registerDetails as any}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refresh}
            />

            <ViewRegisterFieldsModal
                isOpen={isViewModalOpen}
                data={registerDetails as any}
                onClose={() => setIsViewModalOpen(false)}
            />
        </>
    );
};

export default RegisterConfigurationPage;
