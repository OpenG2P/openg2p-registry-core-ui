'use client';

import { TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useIntakeSubmissionDetails } from '@/features/intake-form/hooks/useIntakeSubmissionDetails';
import { useIntakeFormDetails } from '@/features/intake-form/hooks/useIntakeFormDetails';
import MultiSectionAccordionForms from '@/features/intake-form/components/MultiSectionAccordionForms';
import SubmissionHeader from '@/features/intake-form/components/SubmissionHeader';
import IntakeVerificationCard from '@/features/intake-form/components/IntakeVerificationCard';
import RegisterChangeRequestCard from '@/features/change-request/components/RegisterChangeRequestCard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function IntakeFormSubmissionPage() {
    const t = useTranslations();
    const routeParams = useParams<{ type: string, submissionId: string }>();
    const submissionId = routeParams.submissionId;
    const registerType = routeParams.type;

    const { submission, loading: loadingSubmission } = useIntakeSubmissionDetails(submissionId);
    const registerId = submission?.register_id;
    const intakeFormId = submission?.tab_id;
    const { sections, loading: loadingSections } = useIntakeFormDetails(registerId, intakeFormId);
    const loading = loadingSubmission || loadingSections;
    const isDraft = submission?.intake_form_status === 'DRAFT';

    const [changeRequestCount, setChangeRequestCount] = useState<number | undefined>(undefined);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { label: 'Intake Form', href: `/intake-form/${registerType}` },
                    { label: submission?.submission_reference ? 'Ref- ' + String(submission.submission_reference) : '' }
                ]}
                showFilters={false}
                showPagination={false}
                showCapsule={false}
            />

            <div className="mx-7.5 py-6 space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="text-gray-500">Loading...</span>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-7.5">
                        <div className="w-full lg:w-[75%] space-y-6">
                            {!isDraft && (
                                <SubmissionHeader submission={submission} />
                            )}

                            <div className="bg-white rounded-[10px] p-6 border border-[#0000000D] space-y-2">
                                <h3 className="text-[24px] font-semibold text-black px-4 pt-2">
                                    {t('attached_forms')}
                                </h3>
                                <MultiSectionAccordionForms
                                    sections={sections || []}
                                    showActions={isDraft}
                                    onAction={() => console.log("action click")}
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-[25%] space-y-6">
                            {registerId && submission?.submission_id && (
                                <RegisterChangeRequestCard
                                    type={registerType}
                                    registerId={registerId}
                                    internalRecordId={submission.submission_id}
                                    activeTabId={submission.tab_id}
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
        </div>
    );
}
