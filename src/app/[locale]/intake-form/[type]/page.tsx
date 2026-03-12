'use client';

import { useTranslations } from 'next-intl';
import { TopBar } from '@/components/shared';
import { useRouter } from '@/i18n/navigation';
import { SelectedFilters } from '@/features/filter/components';
import { useFilters } from '@/features/filter/hooks/useFilters';
import { useRegister } from '@/context/RegisterContext';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import NewIntakeFormDropdown from '@/features/intake-form/components/NewIntakeFormDropdown';
import { IntakeFormSubmissionRow } from '@/features/intake-form/components/SubmissionRow';
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
                breadcrumb={[{ label: 'Application-Intake Form', href: `/intake-form/${registerType}` }]}
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

            <div className="mx-7.5 bg-white rounded-[10px]">
                <div className="px-2 pt-1">
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
                </div>

                <div className="min-h-[200px]">
                    {formsLoading || submissionsLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <span className="text-black/50">Loading...</span>
                        </div>
                    ) : (
                        submissions?.map((submission, index) => (
                            <IntakeFormSubmissionRow
                                key={submission.submission_id}
                                submission={submission}
                                registerType={registerType}
                                isEven={index % 2 === 0}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}