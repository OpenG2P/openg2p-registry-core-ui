'use client';

import { useTranslations } from 'next-intl';
import { TopBar } from '@/components/shared';
import { useRouter } from '@/i18n/navigation';
import { SelectedFilters } from '@/features/filter/components';
import { useFilters } from '@/features/filter/hooks/useFilters';
import { useRegister } from '@/context/RegisterContext';
import { useParams, useSearchParams } from 'next/navigation';

import NewIntakeFormDropdown from '@/features/intake-form/components/NewIntakeFormDropdown';
import { IntakeFormSubmissionRow } from '@/features/intake-form/components/SubmissionRow';

export default function IntakeFormPage() {
    const t = useTranslations();
    const router = useRouter();

    const routeParams = useParams<{ type: string }>();
    const registerType = routeParams.type;

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const handleSearch = (searchQuery: string) => {
        console.log(searchQuery);
        return;
    };

    const handlePreviousPage = () => {
        console.log('previous');
        return;
    };

    const handleNextPage = () => {
        console.log('next');
        return;
    };

    const { currentRegister, registers } = useRegister();
    console.log(currentRegister, registerType);

    const {
        appliedFilters,
        filterBy,
        filterConfig,
        applyFilters,
        removeFilter,
        clearAllFilters,
    } = useFilters("/api/register/filters");
    // change url once the api is ready

    const dummyForms = [
        {
            intake_form_id: '1',
            intake_form_name: 'Household Registration',
        },
        {
            intake_form_id: '2',
            intake_form_name: 'Farmer Enrollment',
        },
        {
            intake_form_id: '3',
            intake_form_name: 'Child Nutrition Survey',
        },
        {
            intake_form_id: '4',
            intake_form_name: 'School Scholarship Application',
        },
    ];

    const dummySubmissions = [
        {
            intake_form_submission_id: '10000000',
            name: 'John Doe',
            id: '123456',
            intake_form_name: 'Farmer Enrollment',
            datetime: '10 Mar 2026 10:15 AM',
            status: 'Approved',
            enumerated_by: 'Ravi Sharma',
        },
        {
            intake_form_submission_id: '200000000',
            name: 'Sita Devi',
            id: '654321',
            intake_form_name: 'Household Registration',
            datetime: '09 Mar 2026 02:40 PM',
            status: 'Pending',
            enumerated_by: 'Anita Kumari',
        },
    ];

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[{ label: 'Intake Form' }]}
                showFilters
                showPagination
                showCapsule={true}
                capsule={
                    <NewIntakeFormDropdown
                        forms={dummyForms}
                        onSelectForm={(form) => {
                            router.push(
                                `/intake-form/${registerType}/new/${form.intake_form_id}`
                            );
                        }}
                    />
                }
                pageStart={1}
                pageEnd={10}
                total={100}
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

                <div>
                    {dummySubmissions.map((submission, index) => (
                        <IntakeFormSubmissionRow
                            key={submission.intake_form_submission_id}
                            submission={submission}
                            registerType={registerType}
                            isEven={index % 2 === 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}