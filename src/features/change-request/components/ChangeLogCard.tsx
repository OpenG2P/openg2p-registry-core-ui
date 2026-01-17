'use client';

import Image from "next/image";
import { ChangeRequest } from "@/features/change-request/types";

interface Props {
    log: ChangeRequest;
    index: number;
    onViewDetails: () => void;
    isSearchView?: boolean;
}

const statusClassMap: Record<string, string> = {
    REJECTED: "text-red-500",
    PENDING: "text-amber-500",
    APPROVED: "text-green-600",
};

export default function ChangeLogCard({
    log,
    index,
    onViewDetails,
    isSearchView = false,
}: Props) {
    const title =
        log.section_mnemonic?.trim()
            ? log.section_mnemonic
            : `Change Request ${String(index + 1)}`;

    const statusClass = statusClassMap[log.approval_status] ?? "text-gray-500";

    return (
        <div
            className={`rounded-[30px] bg-white px-10 py-5 ${!isSearchView ? "mr-60" : ""}`}
        >
            <div
                className={`grid gap-6 ${isSearchView
                    ? "grid-cols-1 md:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-3"
                    }`}
            >
                <div className="space-y-2 text-[16px] text-[#00000080]">
                    <h3 className="text-lg font-semibold text-black">
                        {title}
                    </h3>

                    <div>
                        Change ID: <span className="text-black font-medium">{log.change_request_id}</span>
                    </div>

                    <div>
                        Status:{' '}
                        <span className={`font-medium ${statusClass}`}>
                            {log.approval_status}
                        </span>
                    </div>

                    <div>
                        Change Date:{' '}
                        <span className="text-black font-medium">
                            {new Date(log.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 text-[16px] text-[#00000080]">
                    <h3 className="text-lg font-semibold text-black invisible">
                        Change Data
                    </h3>
                    <div className="border-l-3 space-y-2 border-[#D9D9D9] pl-6">
                        <div>
                            No. of verification required:{' '}
                            <span className="text-black font-medium">
                                {log.no_of_verifications_required}
                            </span>
                        </div>
                        <div>
                            No. of verification done:{' '}
                            <span className="text-black font-medium">
                                {log.no_of_verifications_done}
                            </span>
                        </div>
                        <div>
                            No. of documents attached:{' '}
                            <span className="text-black font-medium">10</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-[16px] text-[#00000080]">
                    <div className="pl-6 flex items-center gap-0 leading-none">
                        <span className="text-lg font-semibold text-black">
                            Attached Doc
                        </span>
                        <Image
                            src="/attached_doc_icon.png"
                            alt="Attached documents"
                            width={14}
                            height={14}
                            className="ml-1 mb-1"
                        />
                    </div>
                    <div className="flex flex-col gap-2 font-semibold text-black text-[16px] border-l-3 border-[#D9D9D9] pl-6">
                        {["Location Documents", "ID Card Documents", "Other Documents"].map(
                            (label) => (
                                <span
                                    key={label}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    {label}
                                    <Image
                                        src="/right_arrow.png"
                                        alt="arrow"
                                        width={14}
                                        height={14}
                                    />
                                </span>
                            )
                        )}
                    </div>
                </div>

                {isSearchView && (
                    <div className="space-y-2 text-[16px]">
                        <div className="pl-6 flex items-center gap-0 leading-none invisible">
                            <span className="text-lg font-semibold"> Empty </span>
                        </div>

                        <div className="border-l-3 border-[#D9D9D9] pl-6">
                            <div className="flex flex-col gap-2 invisible">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="my-4 border-t-3 border-[#D9D9D9]" />

            <div className="flex items-center justify-between">
                <button
                    onClick={onViewDetails}
                    className="text-[16px] text-black flex items-center gap-2 opacity-50 hover:opacity-100 transition"
                >
                    View Details
                    <Image
                        src="/right_arrow.png"
                        alt="arrow"
                        width={14}
                        height={14}
                    />
                </button>
            </div>
        </div>
    );
}
