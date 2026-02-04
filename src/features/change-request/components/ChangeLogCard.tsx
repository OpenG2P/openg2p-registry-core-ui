'use client';

import Image from "next/image";
import { useTranslations } from 'next-intl';
import { ChangeRequest } from "@/features/change-request/types";
import { useChangeRequestDocuments } from "../hooks/useChangeRequestDocuments";

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

    const t = useTranslations();

    const rawTitle = log.section_mnemonic?.trim();

    const title = rawTitle
        ? t(rawTitle, { default: rawTitle })
        : t('changeRequestFallback', { index: index + 1 });

    const statusClass = statusClassMap[log.approval_status] ?? "text-gray-500";

    const { documents, loading } =
        useChangeRequestDocuments(log.change_request_id);

    return (
        <div
            key={index}
            className={`rounded-[30px] bg-white px-10 py-5 ${!isSearchView ? "mr-60" : ""}`}
        >
            <div
                className={`grid gap-6 ${isSearchView
                    ? "grid-cols-1 md:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-3"
                    }`}
            >
                <div className="space-y-2 text-[16px] text-[#00000080]">
                    <h3 className="text-[24px] font-medium text-black">
                        {title}
                    </h3>

                    <div>
                        {t('changeId')}:{' '}
                        <span className="text-black font-medium">{log.change_request_id}</span>
                    </div>

                    <div>
                        {t('status')}:{' '}
                        <span className={`font-medium ${statusClass}`}>
                            {/* {log.approval_status} */}
                            {t(log.approval_status, {
                                default: log.approval_status,
                            })}
                        </span>
                    </div>

                    <div>
                        {t('changeDate')}:{' '}
                        <span className="text-black font-medium">
                            {new Date(log.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 text-[16px] text-[#00000080]">
                    <h3 className="text-lg font-semibold text-black invisible">
                        Verification
                    </h3>
                    <div className="border-l space-y-2 border-[#D9D9D9] pl-6">
                        <div>
                            {t('verificationsRequired')}:{' '}
                            <span className="text-black font-medium">
                                {log.no_of_verifications_required}
                            </span>
                        </div>
                        <div>
                            {t('verificationsDone')}:{' '}
                            <span className="text-black font-medium">
                                {log.no_of_verifications_done}
                            </span>
                        </div>
                        <div>
                            {t('documentsAttached')}:{' '}
                            <span className="text-black font-medium">{documents.length}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-[16px] text-[#00000080]">
                    <div className="pl-6 flex items-center gap-0 leading-none mt-2">
                        <span className="text-[16px] font-medium text-black">
                            {t('attachedDocuments')}
                        </span>
                        <Image
                            src="/attached_doc_icon.png"
                            alt="Attached documents"
                            width={14}
                            height={14}
                            className="ml-1 mb-1"
                        />
                    </div>
                    <div className="flex flex-col gap-2 font-normal text-black/50 text-[16px] border-l border-[#D9D9D9] pl-6">
                        {documents.slice(0, 3).map((doc, index) => (
                            <span
                                key={index}
                                onClick={() => window.open(doc.document_url, '_blank', 'noopener,noreferrer')}
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
                        ))}

                        {Array.from({ length: Math.max(0, 3 - documents.length) }).map((_, idx) => (
                            <span
                                key={`placeholder-${idx}`}
                                className="flex items-center gap-2 invisible"
                            >
                                placeholder
                            </span>
                        ))}

                    </div>
                </div>

                {isSearchView && (
                    <div className="space-y-2 text-[16px]">
                        <div className="pl-6 flex items-center gap-0 leading-none invisible">
                            <span className="text-lg font-semibold"> Empty </span>
                        </div>

                        <div className="border-l border-[#D9D9D9] pl-6">
                            <div className="flex flex-col gap-2 invisible">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="my-4 border-t border-[#D9D9D9]" />

            <div className="flex items-center justify-between">
                <button
                    onClick={onViewDetails}
                    className="text-[14px] text-black font-normal flex items-center gap-2 opacity-60 hover:opacity-100 transition"
                >
                    {t('viewDetails')}
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
