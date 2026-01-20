import Image from "next/image";
import { ChangeRequest } from "../types/change-request";

export interface ChangeRequestDocument {
    document_label: string;
    document_store_id: string;
    document_url: string;
}
export const DOCUMENT_TYPES = [
    "Location Documents",
    "ID Card Documents",
    "Other Documents",
] as const;

interface Props {
    details: ChangeRequest;
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
    documents = [],
    onApprove,
    onReject,
    loadingAction,
}: Props) {
    return (
        <div className="rounded-[25px] bg-[#F2BA1A33]/80 px-10 py-5 flex flex-col border border-dashed border-[#ED7C22]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoSection
                    title={details?.section_mnemonic || "Change Request"}
                    details={details}
                />
                <VerificationStats
                    details={details}
                    documentsCount={documents.length}
                />
                {/* <AttachedDocuments /> */}
                <AttachedDocuments documents={documents} />
            </div>

            <div className="my-4 border-t-2 border-[#F2BA1A]" />

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    disabled={loadingAction}
                    onClick={onReject}
                    className="px-4 py-2 text-[14px] font-medium rounded-[20px] bg-white text-black/50"
                >
                    Reject Change
                </button>

                <button
                    type="button"
                    disabled={loadingAction}
                    onClick={onApprove}
                    className="px-4 py-2 text-[14px] font-medium rounded-[20px] bg-black text-white"
                >
                    Approve Change
                </button>
            </div>
        </div>
    );
};

const InfoSection = ({ title, details }: { title: string; details: ChangeRequest }) => (
    <div className="space-y-2 text-[16px] text-[#00000080]">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <div>
            Change ID:{" "}
            <span className="text-black font-medium">
                {details.change_request_id}
            </span>
        </div>
        <div>
            Status:{" "}
            <span className={`font-medium ${statusClassMap[details.approval_status] ?? "text-gray-500"}`}>
                {details.approval_status}
            </span>
        </div>
        <div>
            Change Date:{" "}
            <span className="text-black font-medium">
                {new Date(details.created_at).toLocaleDateString()}
            </span>
        </div>
    </div>
);

const VerificationStats = ({ details, documentsCount }: { details: ChangeRequest, documentsCount: number; }) => (
    <div className="space-y-2 text-[16px] text-[#00000080]">
        <h3 className="text-lg font-semibold text-black invisible">
            Verification
        </h3>
        <div className="border-l-2 border-[#F2BA1A] pl-6 space-y-2">
            <div>
                No. of verification required:{" "}
                <span className="text-black font-medium">
                    {details.no_of_verifications_required}
                </span>
            </div>
            <div>
                No. of verification done:{" "}
                <span className="text-black font-medium">
                    {details.no_of_verifications_done}
                </span>
            </div>
            <div>
                No. of documents attached:{" "}
                <span className="text-black font-medium">{documentsCount}</span>
            </div>
        </div>
    </div>
);

// const AttachedDocuments = () => (
//     <div className="space-y-2 text-[16px] text-[#00000080]">
//         <div className="pl-6 flex items-center leading-none">
//             <span className="text-lg font-semibold text-black">
//                 Attached Doc
//             </span>
//             <Image
//                 src="/attached_doc_icon.png"
//                 alt="doc"
//                 width={14}
//                 height={14}
//                 className="ml-1 mb-1"
//             />
//         </div>
//         <div className="border-l-2 border-[#F2BA1A] pl-6 flex flex-col gap-2 font-semibold">
//             {DOCUMENT_TYPES.map((label) => (
//                 <span
//                     key={label}
//                     className="flex items-center gap-2 cursor-pointer"
//                 >
//                     {label}
//                     <Image
//                         src="/right_arrow.png"
//                         alt="arrow"
//                         width={14}
//                         height={14}
//                     />
//                 </span>
//             ))}
//         </div>
//     </div>
// );


const AttachedDocuments = ({ documents = [] }: { documents?: ChangeRequestDocument[] }) => {
    const visibleDocs = documents.slice(0, 3);
    const placeholdersCount = Math.max(0, 3 - visibleDocs.length);

    return (
        <div className="space-y-2 text-[16px] text-[#00000080]">
            <div className="pl-6 flex items-center leading-none">
                <span className="text-lg font-semibold text-black">
                    Attached Doc
                </span>
                <Image
                    src="/attached_doc_icon.png"
                    alt="doc"
                    width={14}
                    height={14}
                    className="ml-1 mb-1"
                />
            </div>

            <div className="border-l-2 border-[#F2BA1A] pl-6 flex flex-col gap-2 font-semibold">
                {
                    visibleDocs.map((doc) => (
                        <span
                            key={doc.document_label}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            {doc.document_label}
                            <Image
                                src="/right_arrow.png"
                                alt="arrow"
                                width={14}
                                height={14}
                            />
                        </span>
                    ))
                }

                {Array.from({ length: placeholdersCount }).map((_, i) => (
                    <span
                        key={`placeholder-${i}`}
                        className="flex items-center gap-2 invisible"
                    >
                        placeholder
                    </span>
                ))}
            </div>
        </div>
    );
};