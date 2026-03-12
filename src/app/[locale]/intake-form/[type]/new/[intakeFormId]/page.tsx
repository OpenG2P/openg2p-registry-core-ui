'use client';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/shared';
import MultiSectionAccordionForms from '@/features/intake-form/components/MultiSectionAccordionForms';
import { useRegister } from '@/context/RegisterContext';
import { useIntakeFormDetails } from '@/features/intake-form/hooks/useIntakeFormDetails';

export default function NewIntakeFormSubmissionPage() {
    const routeParams = useParams<{ type: string, intakeFormId: string }>();
    const intake_form_id = routeParams.intakeFormId;
    const registerType = routeParams.type;

    const { currentRegister } = useRegister();
    const registerId = currentRegister?.register_id;

    const { sections, loading } = useIntakeFormDetails(registerId, intake_form_id);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { label: 'Applications - Intake Form', href: `/intake-form/${registerType}` },
                    { label: 'New Intake' }
                ]}
                showFilters={false}
                showPagination={false}
                showCapsule={false}
            />

            <div className="mx-7.5">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="text-gray-500">Loading...</span>
                    </div>
                ) : (
                    <MultiSectionAccordionForms
                        sections={sections || []}
                    />
                )}
            </div>
        </div>
    );
}
