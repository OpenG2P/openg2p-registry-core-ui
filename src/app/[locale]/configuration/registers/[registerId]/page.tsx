'use client';

import { useEffect, useState } from 'react';
import { BreadcrumbBar, TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import {
    useAllRegister,
    ConfigDetailsSummary,
    getRegisterDetails,
    ConfigurationTabs,
    type Register,
} from '@/features/configuration/shared';
import {
    EditRegisterModal,
    ViewRegisterFieldsModal,
    RegisterTabConfigView,
    RegisterScoreConfigView,
    RegisterInputMechanismConfigView,
    RegisterSchemaView,
} from '@/features/configuration/registers';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { usePagination } from '@/shared/hooks';
import { useRbac } from '@/context/RbacContext';
import { CONFIGURATION_TABS_ACTIONS } from '@/features/configuration/shared/utils/configurationTabs.actions';
import { CONFIGURATION_REGISTERS_ACTIONS } from '@/features/configuration/shared/utils/configurationRegisters.actions';
import { useTranslations } from 'next-intl';
import RegisterSectionConfigView from '@/features/configuration/registers/RegisterSectionConfigView';

type PaginatedTab = 'tabs' | 'sections' | 'scores' | 'input-mechanisms';
type PaginationState = { totalItems: number; currentCount: number };

const EMPTY_PAGINATION: PaginationState = { totalItems: 0, currentCount: 0 };

const RegisterConfigurationPage = () => {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<
        'tabs' | 'sections' | 'scores' | 'input-mechanisms' | 'filter' | 'search' | 'deduplication'
    >('tabs');
    const [tabPage, setTabPage] = useState(1);
    const [sectionPage, setSectionPage] = useState(1);
    const [scorePage, setScorePage] = useState(1);
    const [inputMechanismPage, setInputMechanismPage] = useState(1);

    const [isTabModalOpen, setIsTabModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
    const [isInputMechanismModalOpen, setIsInputMechanismModalOpen] = useState(false);

    const [tabPagination, setTabPagination] = useState({ totalItems: 0, currentCount: 0 });
    const [sectionPagination, setSectionPagination] = useState({ totalItems: 0, currentCount: 0 });
    const [scorePagination, setScorePagination] = useState({ totalItems: 0, currentCount: 0 });
    const [inputMechanismPagination, setInputMechanismPagination] = useState(EMPTY_PAGINATION);

    const paginatedTabs: Record<
        PaginatedTab,
        {
            page: number;
            setPage: React.Dispatch<React.SetStateAction<number>>;
            pagination: PaginationState;
            setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
        }
    > = {
        tabs: { page: tabPage, setPage: setTabPage, pagination: tabPagination, setPagination: setTabPagination },
        sections: { page: sectionPage, setPage: setSectionPage, pagination: sectionPagination, setPagination: setSectionPagination },
        scores: { page: scorePage, setPage: setScorePage, pagination: scorePagination, setPagination: setScorePagination },
        'input-mechanisms': {
            page: inputMechanismPage,
            setPage: setInputMechanismPage,
            pagination: inputMechanismPagination,
            setPagination: setInputMechanismPagination,
        },
    };

    const activePaginatedTab = paginatedTabs[activeTab as PaginatedTab];
    const currentPage = activePaginatedTab?.page ?? 1;
    const paginationInfo = activePaginatedTab?.pagination ?? EMPTY_PAGINATION;

    const { can } = useRbac();
    const canEdit = can(CONFIGURATION_REGISTERS_ACTIONS.edit);
    const canCreate = can(CONFIGURATION_TABS_ACTIONS.create);

    const { registers, loading, refresh } = useAllRegister(1, 100);
    const registerDetails = getRegisterDetails(registerId, registers);

    const tabLabels: Record<string, string> = {
        tabs: t('tabs'),
        sections: t('sections'),
        scores: t('score_definition'),
        'input-mechanisms': t('input_mechanisms'),
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
        paginatedTabs[activeTab as PaginatedTab]?.setPage(1);
    }, [activeTab]);

    useEffect(() => {
        setIsTabModalOpen(false);
        setIsSectionModalOpen(false);
        setIsScoreModalOpen(false);
        setIsInputMechanismModalOpen(false);
    }, [activeTab]);

    const { config } = useRuntimeConfig();
    const PAGE_SIZE = config.pageSize || 10;

    const pagination = usePagination({
        currentPage,
        pageSize: PAGE_SIZE,
        totalItems: paginationInfo.totalItems,
        currentCount: paginationInfo.currentCount,
    });

    const handlePrev = () => {
        activePaginatedTab?.setPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        if (!activePaginatedTab) return;
        const { page, pagination, setPage } = activePaginatedTab;
        if (page * PAGE_SIZE < pagination.totalItems) {
            setPage((prev) => prev + 1);
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
                            showPagination={!!activePaginatedTab}

                            showAddNewButton={
                                canCreate &&
                                (activeTab === 'tabs' ||
                                    activeTab === 'sections' ||
                                    activeTab === 'scores' ||
                                    activeTab === 'input-mechanisms')
                            }

                            addNewButtonText={
                                activeTab === 'tabs'
                                    ? t('add_new_tab')
                                    : activeTab === 'scores'
                                      ? t('add_new_score_type')
                                      : activeTab === 'input-mechanisms'
                                        ? t('add_new_input_mechanism')
                                        : t('add_new_section')
                            }

                            onAddNewButton={() => {
                                if (activeTab === 'tabs') {
                                    setIsTabModalOpen(true);
                                } else if (activeTab === 'sections') {
                                    setIsSectionModalOpen(true);
                                } else if (activeTab === 'scores') {
                                    setIsScoreModalOpen(true);
                                } else if (activeTab === 'input-mechanisms') {
                                    setIsInputMechanismModalOpen(true);
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
                        isModalOpen={isTabModalOpen}
                        onCloseModal={() => setIsTabModalOpen(false)}
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

                {activeTab === 'scores' && (
                    <RegisterScoreConfigView
                        isModalOpen={isScoreModalOpen}
                        onCloseModal={() => setIsScoreModalOpen(false)}
                        currentPage={scorePage}
                        pageSize={PAGE_SIZE}
                        onDataLoaded={(totalItems, currentCount) =>
                            setScorePagination({ totalItems, currentCount })
                        }
                    />
                )}

                {activeTab === 'input-mechanisms' && (
                    <RegisterInputMechanismConfigView
                        isModalOpen={isInputMechanismModalOpen}
                        onCloseModal={() => setIsInputMechanismModalOpen(false)}
                        currentPage={inputMechanismPage}
                        pageSize={PAGE_SIZE}
                        onDataLoaded={(totalItems, currentCount) =>
                            setInputMechanismPagination({ totalItems, currentCount })
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

            {isEditModalOpen && (
                <EditRegisterModal
                    initialData={registerDetails as Register}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={refresh}
                />
            )}

            {isViewModalOpen && (
                <ViewRegisterFieldsModal
                    data={registerDetails as Register}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
        </>
    );
};

export default RegisterConfigurationPage;
