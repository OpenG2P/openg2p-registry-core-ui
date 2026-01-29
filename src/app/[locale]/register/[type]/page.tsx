'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { TopBar } from '@/components/shared';
import { SelectedFilters } from '@/features/filter/components';
import { useRegisterRecords } from '@/features/register/hooks/useRegisterRecords';
import { RegisterRecordCard } from '@/features/register/components';
import { RegisterRecord } from '@/features/register/types';
import { useState } from 'react';
import AddNewDropdown from '@/components/ui/AddNewDropdown';
import { useVCConfigs } from '@/features/register/hooks/useVCConfigs';
import { useInputMechanisms } from '@/shared/hooks';

const VpVerificationModal = dynamic(
    () => import('@/features/verifiable-credentials/components/VpVerificationModal'),
    { ssr: false }
);

export default function RegisterTypePage() {
    const t = useTranslations();

    const {
        registerType,
        registerTypeLabel,
        records,
        isLoadingRecords,
        searchQuery,
        pagination,
        handlers: {
            handlePreviousPage,
            handleNextPage,
            handleSearch
        },
        filters: {
            appliedFilters,
            filterConfig,
            applyFilters,
            removeFilter,
            clearAllFilters
        }
    } = useRegisterRecords();


    const { vcOptions, isLoadingVCs } = useVCConfigs();
    const { mechanisms, isLoadingMechanisms } = useInputMechanisms();

    const [selectedVC, setSelectedVC] = useState<any | null>(null);

    const [openVC, setOpenVC] = useState(false);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: registerTypeLabel }]}
                showFilters
                showPagination
                showCapsule={true}
                capsule={
                    <AddNewDropdown
                        mechanisms={mechanisms}
                        vcOptions={vcOptions}
                        onSelectVC={(vc) => {
                            setSelectedVC(vc);
                            setOpenVC(true);
                        }}
                        onImportCSV={() => console.log('Import CSV')}
                        onImportPDS={() => console.log('Import PDS')}
                    />
                }
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={handlePreviousPage}
                onNext={handleNextPage}
                onApplyFilters={applyFilters}
                appliedFilters={appliedFilters}
                filterConfig={filterConfig}
            />

            <div className="mx-7.5 bg-white rounded-[30px]">
                <div className="px-2 pt-1">
                    <SelectedFilters
                        appliedFilters={appliedFilters}
                        filterConfig={filterConfig}
                        removeFilter={removeFilter}
                        clearAllFilters={clearAllFilters}
                        searchValue={searchQuery}
                        searchPlaceholder={t('search')}
                        onSearch={handleSearch}
                    />
                </div>

                <div className="space-y-2">
                    {isLoadingRecords ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 p-4 w-full overflow-hidden bg-gray-200 animate-pulse"
                                >
                                    <div className="w-16 h-16 rounded-md bg-gray-300 shrink-0" />
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="h-4 bg-gray-300 rounded w-1/3" />
                                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                                    </div>
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="h-3 bg-gray-300 rounded w-2/3" />
                                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                                    </div>
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="h-3 bg-gray-300 rounded w-1/3" />
                                        <div className="h-3 bg-gray-300 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">{t('noItemsFound')}</div>
                    ) : (
                        records.map((record: RegisterRecord, index: number) => (
                            <RegisterRecordCard
                                key={record.internal_record_id}
                                record={record}
                                registerType={registerType}
                                isEven={index % 2 === 0}
                            />
                        ))
                    )}
                </div>
            </div>
            <>
                {openVC && selectedVC && (
                    <VpVerificationModal
                        descriptorSchema={selectedVC.descriptor_schema}
                        onClose={() => {
                            setOpenVC(false);
                            setSelectedVC(null);
                        }}
                    />
                )}
            </>
        </div>
    );
}
