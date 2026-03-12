'use client';

import { TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useIntakeSubmissionDetails } from '@/features/intake-form/hooks/useIntakeSubmissionDetails';

export default function IntakeFormSubmissionPage() {
    const routeParams = useParams<{ type: string, submissionId: string }>();
    const submissionId = routeParams.submissionId;
    const registerType = routeParams.type;

    const { submission, loading: loadingSubmission } = useIntakeSubmissionDetails(submissionId);

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { label: 'Applications - Intake Form', href: `/intake-form/${registerType}` },
                    { label: 'Submission Details' }
                ]}
                showFilters={false}
                showPagination={false}
                showCapsule={false}
            />
            {/* TODO: Api integration done, sync page desing as per figma*/}
            <div className="mx-7.5 py-6">
                <p>SubmissionId: {submission?.submission_id}</p>
                <p>Reference No: {submission?.submission_reference}</p>
                <p>Section payload: {JSON.stringify(submission?.section_payloads?.[0]?.payload_json)}</p>
            </div>
        </div>
    );
}
