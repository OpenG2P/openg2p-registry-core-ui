import Image from "next/image";
import { ChangeRequest } from "../types/change-request";
import { useTranslations } from "next-intl";
import { CHANGE_REQUEST_ACTIONS } from "../utils/changeRequest.actions";
import Can from "@/components/shared/Can";

export interface ChangeRequestDocument {
    document_label: string;
    document_store_id: string;
    document_url: string;
}

interface Props {
    details: ChangeRequest;
    verificationCount: number;
    documents?: ChangeRequestDocument[];
    onApprove: () => void;
    onReject: () => void;
    loadingAction: boolean;
}

const statusClassMap: Record<string, string> = {
    REJECTED: "text-red-500",
    PENDING: "text-amber-500",
    APPROVED: "text-green-600",
};

export default function ChangeRequestHeader({
    details,
    verificationCount,
    documents = [],
    onApprove,
    onReject,
    loadingAction,
}: Props) {
    const t = useTranslations();
    const rawTitle = details?.section_mnemonic?.trim();

    const title = rawTitle
        ? t(rawTitle, { default: rawTitle })
        : t('change_request');
    return (
        <div className="rounded-[10px] bg-[#F2BA1A33]/80 px-10 pt-5 pb-4 flex flex-col border border-dashed border-[#ED7C22]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoSection
                    title={title}
                    details={details}
                />
                <VerificationStats
                    details={details}
                    verificationCount={verificationCount}
                    documentsCount={documents.length}
                />
                <AttachedDocuments documents={documents} />
            </div>

            {details.approval_status === "PENDING" && (
                <Can action={CHANGE_REQUEST_ACTIONS.approve}>
                    <div className="my-3 border-t border-[#F2BA1A]" />
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            disabled={loadingAction}
                            onClick={onReject}
                            className="px-4 py-1.5 text-[14px] font-medium rounded-[10px] bg-white text-black/50"
                        >
                            {t('reject_change')}
                        </button>

                        <button
                            type="button"
                            disabled={loadingAction}
                            onClick={onApprove}
                            className="px-4 py-1.5 text-[14px] font-medium rounded-[10px] bg-black text-white"
                        >
                            {t('approve_change')}
                        </button>
                    </div>
                </Can>
            )}
        </div>
    );
};
const InfoSection = ({
    title,
    details,
}: {
    title: string;
    details: ChangeRequest;
}) => {
    const t = useTranslations();
    return (
        <div className="space-y-2 text-[16px] text-[#00000080]">
            <h3 className="text-[24px] font-medium text-black">{title}</h3>
            <div>
                {t('change_id')}:{" "}
                <span className="text-black font-medium">
                    {details.change_request_id}
                </span>
            </div>
            <div>
                {t("status")}:{" "}
                <span className={`font-medium ${statusClassMap[details.approval_status] ?? "text-gray-500"}`}>
                    {t(details.approval_status, {
                        default: details.approval_status,
                    })}
                </span>
            </div>
            <div>
                {t("change_date")}:{" "}
                <span className="text-black font-medium">
                    {new Date(details.created_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    )
};

const VerificationStats = ({
    details,
    verificationCount,
    documentsCount,
}: {
    details: ChangeRequest;
    verificationCount: number;
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
                        {details.no_of_verifications_required}
                    </span>
                </div>

                <div>
                    {t('verifications_done')}:{" "}
                    <span className="text-black font-medium">
                        {verificationCount}
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

const AttachedDocuments = ({ documents = [] }: { documents?: ChangeRequestDocument[] }) => {
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

            <div className="border-l border-[#F2BA1A] pl-6 flex flex-col gap-2 font-semibold">
                {visibleDocs.map((doc, index) => (
                    <span
                        key={index}
                        onClick={() => window.open(doc.document_url, '_blank', 'noopener,noreferrer')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        {doc.document_label}
                        <Image src="/images/common/arrow_next_01.png" alt="arrow" width={14} height={14} />
                    </span>
                ))}

                {Array.from({ length: placeholdersCount }).map((_, i) => (
                    <span key={i} className="invisible">placeholder</span>
                ))}
            </div>
        </div>
    );
};