'use client';

import { Link } from '@/i18n/navigation';
import { IntakeFormSubmission } from '../types/intake-form';
import { useTranslations } from 'next-intl';

interface IntakeFormSubmissionCardProps {
    submission: IntakeFormSubmission;
    registerType: string;
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex w-full text-neutral-first leading-relaxed overflow-hidden">
            <span className="w-1/2 font-normal text-neutral-first/50 text-[16px] truncate" title={label}>{label}: </span>
            <span className="w-1/2 font-medium text-[14px] truncate" title={value}>{value}</span>
        </div>
    );
}

export function IntakeFormSubmissionCard({ submission, registerType }: IntakeFormSubmissionCardProps) {
    const t = useTranslations();

    const formatLabel = (label: string) => {
        return label
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <Link
            href={`/intake-form/${registerType}/submission/${submission.submission_id}`}
            className="block w-full"
        >
            <div className="rounded-[10px] bg-neutral-second px-10 py-8">
                <div className="grid gap-6 grid-cols-4 text-[14px] text-neutral-first/50">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <KeyValue label={t('submission_id')} value={submission.submission_id} />
                            <KeyValue label={t('form_id')} value={submission.form_id} />
                            <KeyValue label={t('draft_status')} value={submission.draft_status} />
                            <KeyValue label={t('approval_status')} value={submission.approval_status} />
                        </div>
                    </div>


                    <div className="space-y-4">
                        <div className="space-y-1 border-l-2 border-secondary-second pl-6">
                            {/* <KeyValue
                                label={t('no_of_verifications_required') || "No of Verifications Required"}
                                value={String(submission.number_of_verifications_required)}
                            />
                            <KeyValue
                                label={t('no_of_verifications_done') || "No of Verifications Done"}
                                value={String(submission.number_of_verifications_done)}
                            /> */}
                            <KeyValue
                                label={t('created_by') || "Created By"}
                                value={submission.created_by}
                            />
                            <KeyValue
                                label={t('register_ingest_process_status')}
                                value={submission.register_ingest_process_status || '--'}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1 border-l-2 border-secondary-second pl-6">
                            {submission.display_fields?.slice(0, Math.ceil((submission.display_fields?.length || 0) / 2)).map((field) => (
                                <KeyValue
                                    key={field.field_name}
                                    label={formatLabel(field.field_name)}
                                    value={String(field.value ?? '--')}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1 border-l-2 border-secondary-second pl-6">
                            {submission.display_fields?.slice(Math.ceil((submission.display_fields?.length || 0) / 2)).map((field) => (
                                <KeyValue
                                    key={field.field_name}
                                    label={formatLabel(field.field_name)}
                                    value={String(field.value ?? '--')}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
}
