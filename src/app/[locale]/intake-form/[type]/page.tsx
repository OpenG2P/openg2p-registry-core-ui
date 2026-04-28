'use client';

import { TopBar } from '@/components/shared';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
// import { SelectedFilters } from '@/features/filter/components';
// import { useFilters } from '@/features/filter/hooks/useFilters';
import { useRegister } from '@/context/RegisterContext';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import NewIntakeFormDropdown from '@/features/intake-form/components/NewIntakeFormDropdown';
import IntakeFormSubmissionList from '@/features/intake-form/components/SubmissionList';
import { usePagination } from '@/shared/hooks';
import { useIntakeForms } from '@/features/intake-form/hooks/useIntakeForms';
import { useIntakeSubmissions } from '@/features/intake-form/hooks/useIntakeSubmissions';
import { INTAKE_FORM_ACTIONS } from '@/features/intake-form/utils/intakeForm.actions';
import Can from '@/components/shared/Can';

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

    // const {
    //     appliedFilters,
    //     filterConfig,
    //     applyFilters,
    //     removeFilter,
    //     clearAllFilters,
    // } = useFilters("/api/register/filters");

    const { submissions, paginationInfo, loading: submissionsLoading } = useIntakeSubmissions(registerId, {
        searchText: searchQuery,
        currentPage,
        pageSize,
    });

    const pagination = usePagination({
        totalItems: paginationInfo?.number_of_items ?? 0,
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
        <div className="min-h-screen mx-auto bg-secondary-first">
            <TopBar
                breadcrumb={[{ label: t("register_intake_form", { subject: currentRegister?.register_subject || t("register") }) }]}


                showFilters={false}
                showPagination
                showCapsule={true}
                capsule={
                    <Can action={INTAKE_FORM_ACTIONS.create}>
                        <NewIntakeFormDropdown
                            forms={forms || []}
                            onSelectForm={(form) => {
                                router.push(
                                    `/intake-form/${registerType}/new/${form.tab_id}`
                                );
                            }}
                        />
                    </Can>
                }
                pageStart={pagination.pageStart}
                pageEnd={pagination.pageEnd}
                total={pagination.total}
                onPrev={handlePreviousPage}
                onNext={handleNextPage}
                // onApplyFilters={applyFilters}
                // appliedFilters={appliedFilters}
                // filterConfig={filterConfig}
                showSearch
                searchValue={searchQuery || ''}
                searchPlaceholder={t('search')}
                onSearch={handleSearch}
            />

            <div className="px-7.5">
                {/* <SelectedFilters
                    appliedFilters={appliedFilters}
                    filterConfig={filterConfig}
                    removeFilter={removeFilter}
                    clearAllFilters={clearAllFilters}
                    searchValue={searchQuery}
                    searchPlaceholder={t('search')}
                    onSearch={handleSearch}
                    pxClass="px-0.5"
                /> */}
                {formsLoading || submissionsLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-[10px] bg-neutral-second px-10 py-8 animate-pulse">
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="space-y-3">
                                            <div className="h-5 bg-secondary-second rounded w-24" />
                                            <div className="h-4 bg-secondary-first rounded w-full" />
                                            <div className="h-4 bg-secondary-first rounded w-3/4" />
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
                    <div className="text-sm text-secondary-third text-center py-6">
                        {t('no_submissions')}
                    </div>
                )}
            </div>
            <div className='h-15'>&nbsp;</div>
        </div>
    );
}
