'use client';

import { useParams, useRouter } from 'next/navigation';
import { TopBar } from '@/components/shared';
import MultiSectionAccordionForms from '@/features/intake-form/components/MultiSectionAccordionForms';
import { useRegister } from '@/context/RegisterContext';
import { useIntakeFormDetails } from '@/features/intake-form/hooks/useIntakeFormDetails';
import { useIntakeFormAction } from '@/features/intake-form/hooks/useIntakeFormAction';

export default function NewIntakeFormSubmissionPage() {
    const router = useRouter();
    const routeParams = useParams<{ type: string, intakeFormId: string }>();
    const intake_form_id = routeParams.intakeFormId;
    const registerType = routeParams.type;

    const { currentRegister } = useRegister();
    const registerId = currentRegister?.register_id;

    const { sections, loading } = useIntakeFormDetails(registerId, intake_form_id);
    const { handleAction, FormActionModals } = useIntakeFormAction({
        registerId,
        tabId: intake_form_id,
        registerType,
        sections,
        submissionId: null
    });

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { label: `${currentRegister?.register_subject || 'Register'} - Intake Form`, href: `/intake-form/${registerType}` },
                    { label: sections?.[0]?.intake_form_name || String(intake_form_id) }
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
                        formDetailsCard={true}
                        sections={sections || []}
                        onAction={handleAction}
                        onCancel={() => router.push(`/intake-form/${registerType}`)}
                    />

                )}
            </div>

            <FormActionModals />
        </div>
    );
}
