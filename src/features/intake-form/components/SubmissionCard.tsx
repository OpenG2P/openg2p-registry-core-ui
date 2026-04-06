'use client';

import { Link } from '@/i18n/navigation';
import { IntakeFormSubmission } from '../types/intake-form';
import { formatDateTime } from '@/shared/utils/dateUtils';
import { useTranslations } from 'next-intl';

interface IntakeFormSubmissionCardProps {
    submission: IntakeFormSubmission;
    registerType: string;
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-black">
            <span className=" font-normal text-black/50 text-[16px]">{label}: </span>
            <span className="font-medium text-[16px]">{value}</span>
        </div>
    );
}

export function IntakeFormSubmissionCard({ submission, registerType }: IntakeFormSubmissionCardProps) {
    const t = useTranslations();
    return (
        <Link
            href={`/intake-form/${registerType}/submission/${submission.submission_id}`}
            className="block w-full"
        >
            <div className="rounded-[10px] bg-white px-10 py-8">
                <div className="grid gap-6 grid-cols-4 text-[16px] text-[#00000080]">
                    {/* Column 1: Reference */}
                    <div className="space-y-4">
                        <h3 className="text-[16px] font-medium text-[#ED7C22]">
                            {submission.record_name}
                        </h3>
                        <div className="space-y-2">
                            <KeyValue label={t('submission_reference') || "Submission Reference"} value={String(submission.submission_reference)} />
                            <KeyValue label={t('tab_id') || "Tab ID"} value={submission.tab_id} />
                        </div>
                    </div>

                    {/* Column 2: Status */}
                    <div className=" space-y-4 ">
                        <h3 className="text-[18px] font-semibold text-[#ED7C22]">&nbsp;</h3>
                        <div className="space-y-2 border-l-2 border-[#D9D9D9] pl-6">
                            <KeyValue label={t('intake_form_status') || "Intake Form Status"} value={submission.intake_form_status} />
                            <KeyValue label={t('change_request_submission_status') || "Change Request Submission Status"} value={submission.change_request_submission_status ?? 'N/A'} />
                            <KeyValue label={t('approval_status') || "Approval Status"} value={submission.approval_status} />
                        </div>
                    </div>

                    {/* Column 3: Progress */}
                    <div className="space-y-4">
                        <h3 className="text-[18px] font-semibold text-[#ED7C22]">&nbsp;</h3>
                        <div className="space-y-2 border-l-2 border-[#D9D9D9] pl-6">
                            <KeyValue label={t('submission_no_of_attempts') || "Submission No of Attempts"} value={String(submission.submission_no_of_attempts ?? 0)} />
                            <KeyValue label={t('no_of_verifications_required') || "No of Verifications Required"} value={String(submission.no_of_verifications_required)} />
                            <KeyValue label={t('no_of_verifications_done') || "No of Verifications Done"} value={String(submission.no_of_verifications_done)} />
                            <div className="invisible" aria-hidden="true"><KeyValue label="Fake label" value="Fake value" /></div>
                        </div>
                    </div>

                    {/* Column 4: Audit */}
                    <div className="space-y-4">
                        <h3 className="text-[18px] font-semibold text-[#ED7C22]">&nbsp;</h3>
                        <div className="space-y-2 border-l-2 border-[#D9D9D9] pl-6">
                            <KeyValue label={t('created_at') || "Created At"} value={formatDateTime(submission.created_at)} />
                            <KeyValue label={t('last_updated_at') || "Last Updated At"} value={formatDateTime(submission.last_updated_at)} />
                            <KeyValue label={t('approved_at') || "Approved At"} value={formatDateTime(submission.approved_at)} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
