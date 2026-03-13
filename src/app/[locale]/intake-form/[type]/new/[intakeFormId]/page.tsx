'use client';

import { useParams, useRouter } from 'next/navigation';
import { TopBar } from '@/components/shared';
import MultiSectionAccordionForms from '@/features/intake-form/components/MultiSectionAccordionForms';
import { useRegister } from '@/context/RegisterContext';
import { useIntakeFormDetails } from '@/features/intake-form/hooks/useIntakeFormDetails';
import { useFetch } from '@/shared/hooks/useFetch';
import { toast } from 'react-toastify';

export default function NewIntakeFormSubmissionPage() {
    const router = useRouter();
    const routeParams = useParams<{ type: string, intakeFormId: string }>();
    const intake_form_id = routeParams.intakeFormId;
    const registerType = routeParams.type;

    const { currentRegister } = useRegister();
    const registerId = currentRegister?.register_id;

    const { sections, loading } = useIntakeFormDetails(registerId, intake_form_id);
    const { execute: executeSave } = useFetch({ enabled: false });

    const handleAction = async (values: any, action: 'submit' | 'draft') => {
        if (!sections) return;

        const sectionPayloads = sections.map(section => ({
            section_id: section.section_id,
            intake_form_payload_json: values[section.section_register_id] || {}
        }));

        const draftPayload = {
            submission_id: null,
            register_id: registerId,
            tab_id: intake_form_id,
            foundational_id: null,
            link_foundational_id: null,
            no_of_verifications_required: 0,
            section_payloads: sectionPayloads
        };

        try {
            const draftResult = await executeSave('/api/intake-form/submission/save-draft', {
                method: 'POST',
                body: JSON.stringify(draftPayload)
            });

            if (!draftResult) {
                toast.error('Operation failed');
                return;
            }

            if (action === 'submit') {
                const submissionId = draftResult?.response?.response_payload?.submission_id ||
                    draftResult?.response_payload?.submission_id ||
                    draftResult?.submission_id;

                if (!submissionId) {
                    toast.error('Draft saved, but could not finalize without submission ID');
                    return;
                }

                const submitResult = await executeSave('/api/intake-form/submission/finalize', {
                    method: 'POST',
                    body: JSON.stringify({
                        submission_id: submissionId,
                        current_page: 0,
                        page_size: 10,
                        sort_by: "",
                        filter_by: "",
                        search_text: ""
                    })
                });

                if (submitResult) {
                    toast.success('Form submitted successfully');
                    router.push(`/intake-form/${registerType}`);
                } else {
                    toast.error('Submission failed');
                }
            } else {
                toast.success('Draft saved successfully');
                router.push(`/intake-form/${registerType}`);
            }
        } catch (error) {
            toast.error('Error occured while saving form');
        }
    };

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { label: 'Intake Form', href: `/intake-form/${registerType}` },
                    { label: `${intake_form_id}` }
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
                        onAction={handleAction}
                        onCancel={() => router.push(`/intake-form/${registerType}`)}
                    />
                )}
            </div>
        </div>
    );
}
