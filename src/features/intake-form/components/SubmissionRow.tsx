'use client';

import { Link } from '@/i18n/navigation';

interface IntakeFormSubmission {
    intake_form_submission_id: string;
    name: string;
    id: string;
    intake_form_name: string;
    datetime: string;
    status: string;
    enumerated_by: string;
}

interface IntakeFormSubmissionRowProps {
    submission: IntakeFormSubmission;
    registerType: string;
    isEven: boolean;
}

export function IntakeFormSubmissionRow({ submission, registerType, isEven }: IntakeFormSubmissionRowProps) {
    return (
        <Link
            href={`/intake-form/${registerType}/submission/${submission.intake_form_submission_id}`}
            className="block w-full"
        >
            <div
                className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 p-4 w-full overflow-hidden ${isEven ? 'bg-[#D9D9D940]' : 'bg-white'
                    }`}
            >
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#ED7C22] text-sm sm:text-base mb-0.5 truncate">
                        {submission.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-bold text-gray-600">ID: </span>
                        <span className="font-bold text-gray-900">
                            {submission.id}
                        </span>
                    </p>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Intake Form:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.intake_form_name}
                        </span>
                    </p>

                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Enumerated By:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.enumerated_by}
                        </span>
                    </p>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Datetime:{' '}
                        </span>
                        <span className="font-bold">
                            {submission.datetime}
                        </span>
                    </p>

                    <p className="text-xs sm:text-sm text-gray-900 truncate">
                        <span className="font-bold text-gray-600">
                            Status:{' '}
                        </span>
                        <span
                            className={`font-bold ${submission.status === 'Approved'
                                ? 'text-green-600'
                                : submission.status === 'Pending'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}
                        >
                            {submission.status}
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
}