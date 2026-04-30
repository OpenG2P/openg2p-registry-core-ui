'use client';

import { TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useIntakeSubmissions } from '@/features/intake-form/hooks/useIntakeSubmissions';
import { useIntakeFormDetails } from '@/features/intake-form/hooks/useIntakeFormDetails';
import { useIntakeFormTabs } from '@/features/intake-form/hooks/useIntakeFormTabs';
import { useIntakeFormTabRecords } from '@/features/intake-form/hooks/useIntakeFormTabRecords';
import MultiSectionAccordionForms from '@/features/intake-form/components/MultiSectionAccordionForms';
import SubmissionHeader from '@/features/intake-form/components/SubmissionHeader';
import IntakeVerificationCard from '@/features/intake-form/components/IntakeVerificationCard';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useIntakeFormSectionAction } from '@/features/intake-form/hooks/useIntakeFormSectionAction';

import { RegisterFlattenedRecord } from '@/features/register/types';
import { useRegister } from '@/context/RegisterContext';
import { useRbac } from '@/context/RbacContext';
import { INTAKE_FORM_ACTIONS } from '@/features/intake-form/utils/intakeForm.actions';


export default function IntakeFormSubmissionPage() {
    const t = useTranslations();
    const routeParams = useParams<{ type: string, submissionId: string }>();
    const submissionId = routeParams.submissionId;
    const registerType = routeParams.type;

    const { currentRegister } = useRegister();
    const { can } = useRbac();
    const canCreate = can(INTAKE_FORM_ACTIONS.create);

    const registerId = currentRegister?.register_id;
    const { submissions, loading: loadingSubmissions } = useIntakeSubmissions(registerId);

    const submission = useMemo(() => {
        return submissions?.find((s: any) => s.submission_id === submissionId);
    }, [submissions, submissionId]);

    const intakeFormId = submission?.form_id;
    const { sections, form_name, form_description, loading: loadingSections } = useIntakeFormDetails(intakeFormId);

    const { tabs, loading: loadingTabs } = useIntakeFormTabs(intakeFormId);
    const tabId = tabs[0]?.tab_id;

    const { section_payloads, loading: loadingRecords } = useIntakeFormTabRecords(submissionId, tabId);

    const loading = loadingSubmissions || loadingSections || loadingTabs || loadingRecords;
    const isDraft = submission?.draft_status === 'DRAFT';

    const { handleAction, FormActionModals } = useIntakeFormSectionAction({
        registerId: submission?.register_id || '',
        formId: intakeFormId || '',
        registerType,
        submissionId,
        onSuccess: () => { }
    });

    const sectionDataMap = useMemo(() => {
        if (!section_payloads) return {};

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        for (const section of section_payloads) {
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
    }, [section_payloads]);

    return (
        <div className="min-h-screen mx-auto bg-secondary-first">
            <TopBar
                breadcrumb={[
                    {
                        label: t("register_intake_form", { subject: currentRegister?.register_subject || t("register") }),
                        href: `/intake-form/${registerType}`
                    },
                    { label: isDraft ? (form_name || "") : (submission?.submission_id ? t("id") + "-" + String(submission.submission_id) : "") }
                ]}
                showFilters={false}
                showPagination={false}
                showCapsule={false}
            />

            <div className={`mx-7.5 ${isDraft ? '' : 'py-6 space-y-6'}`}>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="text-neutral-first/50">{t('loading')}</span>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className={`w-full ${isDraft ? '' : 'lg:w-[75%]'} space-y-6`}>
                            {!isDraft && (
                                <SubmissionHeader submission={submission} section_payloads={section_payloads} onActionComplete={() => window.location.reload()} />
                            )}

                            <MultiSectionAccordionForms
                                form_name={form_name}
                                form_description={form_description}
                                sections={sections || []}
                                schemaData={sectionDataMap}
                                showActions={isDraft && canCreate}
                                onAction={handleAction}
                                submissionId={submissionId}
                                registerType={registerType}
                            />
                        </div>

                        {!isDraft && (
                            <div className="w-full lg:w-[25%] space-y-6">
                                <IntakeVerificationCard
                                    submission_id={submissionId}
                                    isPending={!isDraft && submission?.approval_status === "PENDING"}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <FormActionModals />
        </div>
    );
}
