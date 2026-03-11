'use client';
import { TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';

export default function IntakeFormSubmissionPage() {
    const routeParams = useParams<{ type: string, submissionId: string }>();
    const intake_form_submission_id = routeParams.submissionId;
    const registerType = routeParams.type;

    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4]">
            <TopBar
                breadcrumb={[
                    { label: 'Intake Form', href: `/intake-form/${registerType}` },
                    { label: 'New Intake Form' }
                ]}
                showFilters={false}
                showPagination={false}
                showCapsule={false}
            />

            <div className="mx-7.5 bg-white rounded-[10px]">
                {/* "LIST OF SECTIONS in left "
                "in right IF Draft show description else show verifications" */}
            </div>
        </div>
    );
}
