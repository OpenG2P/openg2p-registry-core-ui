'use client';

import Image from "next/image";
import { useTranslations } from "next-intl";
import { IntakeSubmissionPayload } from "../types/intake-form";
import { toast } from "react-toastify";
import { useFetch } from "@/shared/hooks/useFetch";
import { useMemo } from "react";
import { useIntakeFormDocuments } from "../hooks/useIntakeFormDocuments";
import { UploadedDocument } from "@/shared/types";

const statusClassMap: Record<string, string> = {
    REJECTED: "text-red-500",
    PENDING: "text-amber-500",
    APPROVED: "text-green-600",
    DRAFT: "text-blue-500",
    SUBMITTED: "text-indigo-500",
    FINALIZED: "text-green-600",
};

interface Props {
    submission?: IntakeSubmissionPayload | null;
    onActionComplete?: () => void;
}

export default function SubmissionHeader({ submission, onActionComplete }: Props) {
    const t = useTranslations();
    const { execute, loading: loadingAction } = useFetch({ enabled: false });

    const documents = useMemo(() => {
        const allDocs: UploadedDocument[] = [];
        submission?.section_payloads?.forEach(section => {
            if (section.documents) {
                allDocs.push(...section.documents);
            }
        });
        return allDocs;
    }, [submission]);

    const { documents: docsWithUrls } = useIntakeFormDocuments(documents);

    const handleAction = async (type: 'approve' | 'reject') => {
        if (!submission?.submission_id) return;

        try {
            const url = type === 'approve'
                ? '/api/intake-form/submission/approve'
                : '/api/intake-form/submission/reject';

            const result = await execute(url, {
                method: 'POST',
                body: JSON.stringify({ submission_id: submission.submission_id }),
            });

            if (result?.approval_status=="APPROVED" || result?.approval_status=="REJECTED") {
                toast.success(`Submission ${type}d successfully`);
                onActionComplete?.();
            } else {
                toast.error(`Failed to ${type} submission`);
            }
        } catch (error) {
            toast.error(`An error occurred while trying to ${type} the submission`);
        }
    };

    return (
        <div className="rounded-[10px] bg-[#F2BA1A33]/80 px-10 py-5 flex flex-col border border-dashed border-[#ED7C22]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoSection submission={submission} />
                <VerificationStats submission={submission} documentsCount={documents.length} />
                <AttachedDocuments documents={docsWithUrls} />
            </div>

            {submission?.approval_status === "PENDING" && (
                <>
                    <div className="my-4 border-t-2 border-[#F2BA1A]" />
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => handleAction('reject')}
                            className="px-4 py-2 text-[14px] font-medium rounded-[10px] bg-white text-black/50"
                        >
                            {t('reject_submission')}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleAction('approve')}
                            className="px-4 py-2 text-[14px] font-medium rounded-[10px] bg-black text-white"
                        >
                            {t('approve_submission')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const InfoSection = ({ submission }: { submission?: IntakeSubmissionPayload | null }) => {
    const t = useTranslations();
    return (
        <div className="space-y-2 text-[16px] text-[#00000080]">
            <h3 className="text-[24px] font-medium text-black">
                {t('intake_submission')}
            </h3>
            <div>
                Reference No:{" "}
                <span className="text-black font-medium">
                    {submission?.submission_reference}
                </span>
            </div>
            <div>
                Form Status:{" "}
                <span className={`font-medium ${statusClassMap[submission?.intake_form_status || ''] ?? "text-gray-500"}`}>
                    {submission?.intake_form_status}
                </span>
            </div>
            <div>
                CR Status:{" "}
                <span className="text-black font-medium">
                    {submission?.change_request_submission_status ?? 'N/A'}
                </span>
            </div>
            <div>
                Approval Status:{" "}
                <span className={`font-medium ${statusClassMap[submission?.approval_status || ''] ?? "text-gray-500"}`}>
                    {submission?.approval_status}
                </span>
            </div>
            <div>
                Created Date:{" "}
                <span className="text-black font-medium">
                    {submission?.created_at ? (() => {
                        const [dp, tp] = submission.created_at.split(/[T ]/);
                        const [y, m, d] = dp.split('-').map(Number);
                        const [h, mi] = (tp || '00:00').split(':').map(Number);
                        return new Date(y, m - 1, d, h, mi).toLocaleDateString();
                    })() : '--'}
                </span>
            </div>
        </div>
    );
};

const VerificationStats = ({ 
    submission, 
    documentsCount 
}: { 
    submission?: IntakeSubmissionPayload | null;
    documentsCount: number;
}) => {
    const t = useTranslations();
    return (
        <div className="space-y-2 text-[16px] text-[#00000080]">
            <h3 className="text-lg font-semibold text-black invisible">
                Verification
            </h3>

            <div className="border-l border-[#F2BA1A] pl-6 space-y-2">
                <div>
                    {t('verifications_required')}:{" "}
                    <span className="text-black font-medium">
                        {submission?.no_of_verifications_required}
                    </span>
                </div>

                <div>
                    {t('verifications_done')}:{" "}
                    <span className="text-black font-medium">
                        {submission?.no_of_verifications_done}
                    </span>
                </div>

                <div>
                    {t('documents_attached')}:{" "}
                    <span className="text-black font-medium">
                        {documentsCount}
                    </span>
                </div>
            </div>
        </div>
    );
};

const AttachedDocuments = ({ documents = [] }: { documents?: any[] }) => {
    const t = useTranslations();

    const visibleDocs = documents.slice(0, 3);
    const placeholdersCount = Math.max(0, 3 - visibleDocs.length);

    return (
        <div className="space-y-2 text-[16px] text-[#00000080]">
            <div className="pl-6 flex items-center leading-none mt-2">
                <span className="text-[16px] font-medium text-black">
                    {t('attached_documents')}
                </span>
                <Image
                    src="/images/changerequest/attached_doc_icon.png"
                    alt="doc"
                    width={14}
                    height={14}
                    className="ml-1 mb-1"
                />
            </div>

            <div className="border-l border-[#F2BA1A] pl-6 flex flex-col gap-2 font-semibold min-h-[60px]">
                {visibleDocs.map((doc, index) => (
                    <span
                        key={index}
                        onClick={() => doc.document_url && window.open(doc.document_url, '_blank', 'noopener,noreferrer')}
                        className={`flex items-center gap-2 ${doc.document_url ? 'cursor-pointer hover:underline' : 'opacity-50'}`}
                    >
                        {doc.document_label}
                        <Image src="/images/common/right_arrow.png" alt="arrow" width={14} height={14} />
                    </span>
                ))}

                {Array.from({ length: placeholdersCount }).map((_, i) => (
                    <span key={i} className="invisible">placeholder</span>
                ))}
            </div>
        </div>
    );
};
