'use client';

import { useEffect, useState } from 'react';
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
import { useTranslations } from 'next-intl';
import RegisterSectionConfigView from '@/features/configuration/registers/RegisterSectionConfigView';


const RegisterConfigurationPage = () => {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'tabs' | 'sections' | 'filter' | 'search' | 'deduplication'>('tabs');
    const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
    const [tabPage, setTabPage] = useState(1);
    const [sectionPage, setSectionPage] = useState(1);

    const [isTabModalOpen, setIsTabModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

    const [tabPagination, setTabPagination] = useState({ totalItems: 0, currentCount: 0 });
    const [sectionPagination, setSectionPagination] = useState({ totalItems: 0, currentCount: 0 });

    const currentPage = activeTab === 'tabs' ? tabPage : sectionPage;

    const paginationInfo = activeTab === 'tabs' ? tabPagination : sectionPagination;

    const { can } = useRbac();
    const canEdit = can(CONFIGURATION_REGISTERS_ACTIONS.edit);
    const canCreate = can(CONFIGURATION_TABS_ACTIONS.create);

    const { registers, loading, refresh } = useAllRegister(1, 100);
    const registerDetails = getRegisterDetails(registerId, registers);

    const tabLabels: Record<string, string> = {
        tabs: t('tabs'),
        sections: t('sections'),
        filter: t('filter_schema'),
        search: t('search_schema'),
        deduplication: t('deduplication_schema'),
    };

    const breadcrumb = useBreadcrumb({
        rootItem: { label: t('registers'), href: '/configuration/registers' },
        customItems: [
            { label: `${registerDetails?.register_mnemonic || ''} - ${tabLabels[activeTab]}`, href: `/configuration/registers/${registerId}` }
        ]
    });

    useEffect(() => {
        if (activeTab === 'tabs') setTabPage(1);
        if (activeTab === 'sections') setSectionPage(1);
    }, [activeTab]);

    useEffect(() => {
        setIsTabModalOpen(false);
        setIsSectionModalOpen(false);
    }, [activeTab]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { config } = useRuntimeConfig();
    const PAGE_SIZE = config.pageSize || 10;

    const pagination = usePagination({
        currentPage,
        pageSize: PAGE_SIZE,
        totalItems: paginationInfo.totalItems,
        currentCount: paginationInfo.currentCount,
    });

    const handlePrev = () => {
        if (activeTab === 'tabs') {
            setTabPage(prev => Math.max(1, prev - 1));
        } else if (activeTab === 'sections') {
            setSectionPage(prev => Math.max(1, prev - 1));
        }
    };

    const handleNext = () => {
        if (activeTab === 'tabs') {
            if (tabPage * PAGE_SIZE < tabPagination.totalItems) {
                setTabPage(prev => prev + 1);
            }
        } else if (activeTab === 'sections') {
            if (sectionPage * PAGE_SIZE < sectionPagination.totalItems) {
                setSectionPage(prev => prev + 1);
            }
        }
    };

    if (loading || !registerDetails.register_id) {
        return (
            <div className="min-h-screen bg-secondary-first flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-second"></div>
            </div>
        );
    }



    return (
        <>
            <div className="pt-10 px-7.5 mb-6">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <ConfigDetailsSummary
                title={registerDetails?.register_mnemonic || t('none')}
                description={registerDetails?.register_description}
                extraInfo1={registerDetails?.master_register_mnemonic || t('none')}
                extraInfo2={registerDetails.register_purpose || t('none')}
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
                            showPagination={activeTab === 'tabs' || activeTab === 'sections'}

                            showAddNewButton={
                                canCreate && (activeTab === 'tabs' || activeTab === 'sections')
                            }

                            addNewButtonText={
                                activeTab === 'tabs'
                                    ? t('add_new_tab')
                                    : t('add_new_section')
                            }

                            onAddNewButton={() => {
                                if (activeTab === 'tabs') {
                                    setIsTabModalOpen(true);
                                } else if (activeTab === 'sections') {
                                    setIsSectionModalOpen(true);
                                }
                            }}
                            showSecondaryButton={false}
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


            <div className="mt-0">
                {activeTab === 'tabs' && (
                    <RegisterTabConfigView
                        onAddNewRegister={() => setIsModalOpen(true)}
                        isModalOpen={isTabModalOpen}
                        onCloseModal={() => setIsTabModalOpen(false)}
                        isIntakeModalOpen={false}
                        onCloseIntakeModal={() => setIsIntakeModalOpen(false)}
                        page={tabPage}
                        pageSize={PAGE_SIZE}
                        onDataLoaded={(totalItems, currentCount) =>
                            setTabPagination({ totalItems, currentCount })
                        }
                    />
                )}

                {activeTab === 'sections' && (
                    <RegisterSectionConfigView
                        isModalOpen={isSectionModalOpen}
                        onCloseModal={() => setIsSectionModalOpen(false)}
                        page={sectionPage}
                        pageSize={PAGE_SIZE}
                        onDataLoaded={(totalItems, currentCount) =>
                            setSectionPagination({ totalItems, currentCount })
                        }
                    />
                )}

                {['filter', 'search', 'deduplication'].includes(activeTab) && (
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
