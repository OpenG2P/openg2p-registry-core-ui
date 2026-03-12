'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { IntakeFormSubmission } from '../types/intake-form';

export function formatDateTime(value?: string | null) {
    if (!value) return '-- -- ----';

    const safeValue = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(safeValue);

    return date.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

interface IntakeFormSubmissionRowProps {
    submission: IntakeFormSubmission;
    registerType: string;
    isEven: boolean;
}

export function IntakeFormSubmissionRow({ submission, registerType, isEven }: IntakeFormSubmissionRowProps) {
    const t = useTranslations();

    return (
        <Link
            href={`/intake-form/${registerType}/submission/${submission.submission_id}`}
            className="block w-full"
        >
            <div
                className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 p-4 w-full overflow-hidden ${isEven ? 'bg-[#D9D9D940]' : 'bg-white'
                    }`}
            >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-300 rounded-md shrink-0" />

                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-bold text-gray-600">Name: </span>
                        <span className="font-bold text-gray-900">
                        </span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-bold text-gray-600">Refrence No: </span>
                        <span className="font-bold text-gray-900">
                            {submission.submission_reference}
                        </span>
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Channel:{' '}
                        </span>
                        <span className="font-bold">

                        </span>
                    </p>

                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Submitted By:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.created_by}
                        </span>
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Date/Time:{' '}
                        </span>
                        <span className="font-bold">
                            {formatDateTime(submission.created_at)}
                        </span>
                    </p>

                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Form Status:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.intake_form_status}
                        </span>
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Verification:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.no_of_verifications_done} / {submission.no_of_verifications_required}
                        </span>
                    </p>


                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Approval Status:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.approval_status}
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
}