'use client';

import { TopBar } from '@/components/shared';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { SelectedFilters } from '@/features/filter/components';
import { useFilters } from '@/features/filter/hooks/useFilters';
import { useRegister } from '@/context/RegisterContext';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import NewIntakeFormDropdown from '@/features/intake-form/components/NewIntakeFormDropdown';
import IntakeFormSubmissionList from '@/features/intake-form/components/SubmissionList';
import { usePagination } from '@/shared/hooks';
import { useIntakeForms } from '@/features/intake-form/hooks/useIntakeForms';
import { useIntakeSubmissions } from '@/features/intake-form/hooks/useIntakeSubmissions';

export default function IntakeFormPage() {
    const t = useTranslations();
    const router = useRouter();

    const routeParams = useParams<{ type: string }>();
    const registerType = routeParams.type;

    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { currentRegister } = useRegister();
    const registerId = currentRegister?.register_id;

    const { forms, loading: formsLoading } = useIntakeForms(registerId);

    const {
        appliedFilters,
        filterConfig,
        applyFilters,
        removeFilter,
        clearAllFilters,
    } = useFilters("/api/register/filters");

    const tabId = "intake_form_tab_1"
    const { submissions, loading: submissionsLoading } = useIntakeSubmissions(registerId, {
        tabId,
        searchText: searchQuery,
        currentPage,
        pageSize,
    });

    const pagination = usePagination({
        totalItems: submissions?.length || 0,
        currentPage,
        pageSize,
        currentCount: submissions?.length || 0,
    });

    const handleSearch = (newSearchQuery: string) => {
        setSearchQuery(newSearchQuery);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: `${currentRegister?.register_subject || 'Register'} - Intake Form` }]}


                showFilters
                showPagination
                showCapsule={true}
                capsule={
                    <NewIntakeFormDropdown
                        forms={forms || []}
                        onSelectForm={(form) => {
                            router.push(
                                `/intake-form/${registerType}/new/${form.tab_id}`
                            );
                        }}
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

            <div className="px-7.5">
                <SelectedFilters
                    appliedFilters={appliedFilters}
                    filterConfig={filterConfig}
                    removeFilter={removeFilter}
                    clearAllFilters={clearAllFilters}
                    searchValue={searchQuery}
                    searchPlaceholder={t('search')}
                    onSearch={handleSearch}
                    pxClass="px-0.5"
                />
                {formsLoading || submissionsLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-[10px] bg-white px-10 py-8 animate-pulse">
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="space-y-3">
                                            <div className="h-5 bg-gray-200 rounded w-24" />
                                            <div className="h-4 bg-gray-100 rounded w-full" />
                                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : submissions && submissions.length > 0 ? (
                    <IntakeFormSubmissionList
                        submissions={submissions}
                        registerType={registerType}
                    />
                ) : (
                    <div className="text-sm text-gray-400 text-center py-6">
                        No submissions found
                    </div>
                )}
            </div>
        </div>
    );
}
