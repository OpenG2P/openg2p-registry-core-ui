'use client';

import { TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useIntakeSubmissionDetails } from '@/features/intake-form/hooks/useIntakeSubmissionDetails';
import { useIntakeFormDetails } from '@/features/intake-form/hooks/useIntakeFormDetails';
import MultiSectionAccordionForms from '@/features/intake-form/components/MultiSectionAccordionForms';
import SubmissionHeader from '@/features/intake-form/components/SubmissionHeader';
import IntakeVerificationCard from '@/features/intake-form/components/IntakeVerificationCard';
import SubmissionChangeRequestCard from '@/features/intake-form/components/SubmissionChangeRequestCard';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useIntakeFormAction } from '@/features/intake-form/hooks/useIntakeFormAction';
import { RegisterFlattenedRecord } from '@/features/register/types';
import { useRegister } from '@/context/RegisterContext';


export default function IntakeFormSubmissionPage() {
    const t = useTranslations();
    const routeParams = useParams<{ type: string, submissionId: string }>();
    const submissionId = routeParams.submissionId;
    const registerType = routeParams.type;

    const { currentRegister } = useRegister();


    const { submission, loading: loadingSubmission, refetch } = useIntakeSubmissionDetails(submissionId);
    const registerId = submission?.register_id;
    const intakeFormId = submission?.tab_id;
    const { sections, loading: loadingSections } = useIntakeFormDetails(registerId, intakeFormId);
    const loading = loadingSubmission || loadingSections;
    const isDraft = submission?.intake_form_status === 'DRAFT';

    const [changeRequestCount, setChangeRequestCount] = useState<number | undefined>(undefined);

    const { handleAction, FormActionModals } = useIntakeFormAction({
        registerId,
        tabId: intakeFormId || '',
        registerType,
        sections,
        submissionId,
        onSuccess: () => {
            if (refetch) refetch();
        }
    });
    // TODO: Recheck the data structure for submission
    // Also check the response of get_submission api.
    const sectionDataMap = useMemo(() => {
        if (!submission?.section_payloads) return {};

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        for (const section of submission.section_payloads) {
            if (!section.records?.length) continue;

            const existing = map[section.section_register_id];

            if (section.is_list === true) {
                if (existing && 'records' in existing) {
                    const existingList = existing as { records: RegisterFlattenedRecord[] };
                    existingList.records = [...existingList.records, ...section.records];
                } else {
                    map[section.section_register_id] = { records: [...section.records] };
                }
            } else {
                if (existing && !('records' in existing)) {
                    map[section.section_register_id] = { ...existing, ...section.records[0] };
                } else if (!existing) {
                    map[section.section_register_id] = { ...section.records[0] };
                }
            }
        }

        return map;
    }, [submission?.section_payloads]);

    // console.log(sectionDataMap, "sectionsDataMap")

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { 
                        label: t("register_intake_form", { subject: currentRegister?.register_subject || t("register") }), 
                        href: `/intake-form/${registerType}` 
                    },
                    { label: submission?.submission_reference ? t("ref") + String(submission.submission_reference) : "" }
                ]}



                showFilters={false}
                showPagination={false}
                showCapsule={false}
            />

            <div className="mx-7.5 py-6 space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="text-gray-500">{t('loading')}</span>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-7.5">
                        <div className="w-full lg:w-[75%] space-y-6">
                            {!isDraft && (
                                <SubmissionHeader submission={submission} onActionComplete={refetch} />
                            )}

                            <div className=" bg-[#FFFF] rounded-[10px] p-6 border border-[#0000000D] space-y-2">
                                <MultiSectionAccordionForms
                                    sections={sections || []}
                                    schemaData={sectionDataMap}
                                    showActions={isDraft}
                                    onAction={handleAction}
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-[25%] space-y-6">
                            {submission?.submission_id && (
                                <SubmissionChangeRequestCard
                                    type={registerType}
                                    submissionId={submission.submission_id}
                                    count={changeRequestCount}
                                    onCountLoaded={setChangeRequestCount}
                                />
                            )}

                            <div className={isDraft ? 'opacity-50 pointer-events-none' : ''}>
                                <IntakeVerificationCard
                                    submission={submission}
                                    isPending={!isDraft && submission?.approval_status === "PENDING"}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FormActionModals />
        </div>
    );
}
