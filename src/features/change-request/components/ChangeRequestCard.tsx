'use client';

import Image from "next/image";
import { useTranslations } from 'next-intl';
import { ChangeRequest } from "@/features/change-request/types";
import { useChangeRequestDocuments } from "../hooks/useChangeRequestDocuments";

interface Props {
    changeRequest: ChangeRequest;
    index: number;
    onViewDetails: () => void;
}

const statusClassMap: Record<string, string> = {
    REJECTED: "text-toast-failed",
    PENDING: "text-amber-500",
    APPROVED: "text-toast-success",
};

export default function ChangeRequestCard({
    changeRequest,
    index,
    onViewDetails,
}: Props) {

    const t = useTranslations();

    const rawTitle = changeRequest.section_mnemonic?.trim();

    const title = rawTitle
        ? t(rawTitle, { default: rawTitle })
        : t('change_request_fallback', { index: index + 1 });

    // const title = `${(index + 1).toString().padStart(2, '0')} ${rawTitle
    //         ? t(rawTitle, { default: rawTitle })
    //         : t('change_request_fallback', { index: index + 1 })
    //     }`;

    const statusClass = statusClassMap[changeRequest.approval_status] ?? "text-neutral-first/50";

    const { documents, loading } =
        useChangeRequestDocuments(changeRequest.change_request_id);

    return (
        <div
            key={index}
            className="rounded-[10px] bg-neutral-second px-10 py-5"
        >
            <div
                className="grid gap-6 grid-cols-4"
            >
                <div className="space-y-2 text-[16px] text-neutral-first/50">
                    <h3
                        className="text-[24px] font-medium text-neutral-first truncate"
                        title={title}
                    >
                        {title}
                    </h3>

                    <div className="flex w-full overflow-hidden">
                        <span className="w-1/2 truncate" title={t('change_id')}>{t('change_id')}:</span>
                        <span className="w-1/2 pl-4 text-neutral-first font-medium truncate" title={changeRequest.change_request_id}>{changeRequest.change_request_id}</span>
                    </div>

                    <div className="flex w-full overflow-hidden">
                        <span className="w-1/2 truncate" title={t('status')}>{t('status')}:</span>
                        <span className={`w-1/2 pl-4 font-medium truncate ${statusClass}`} title={changeRequest.approval_status}>
                            {changeRequest.approval_status}
                        </span>
                    </div>

                    <div className="flex w-full overflow-hidden">
                        <span className="w-1/2 truncate" title={t('change_date')}>{t('change_date')}:</span>
                        <span className="w-1/2 pl-4 text-neutral-first font-medium truncate" title={new Date(changeRequest.created_at).toLocaleDateString()}>
                            {new Date(changeRequest.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 text-[16px] text-neutral-first/50">
                    <h3 className="text-lg font-semibold text-neutral-first invisible">
                        Verification
                    </h3>
                    <div className="border-l space-y-2 border-secondary-second pl-6">
                        <div className="flex w-full overflow-hidden">
                            <span className="w-1/2 truncate" title={t('verifications_required')}>{t('verifications_required')}:</span>
                            <span className="w-1/2 pl-4 text-neutral-first font-medium truncate" title={changeRequest.no_of_verifications_required?.toString()}>
                                {changeRequest.no_of_verifications_required}
                            </span>
                        </div>
                        <div className="flex w-full overflow-hidden">
                            <span className="w-1/2 truncate" title={t('verifications_done')}>{t('verifications_done')}:</span>
                            <span className="w-1/2 pl-4 text-neutral-first font-medium truncate" title={changeRequest.no_of_verifications_done?.toString()}>
                                {changeRequest.no_of_verifications_done}
                            </span>
                        </div>
                        <div className="flex w-full overflow-hidden">
                            <span className="w-1/2 truncate" title={t('documents_attached')}>{t('documents_attached')}:</span>
                            <span className="w-1/2 pl-4 text-neutral-first font-medium truncate" title={documents.length.toString()}>{documents.length}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-[16px] text-neutral-first/50">
                    <div className="pl-6 flex items-center gap-0 leading-none mt-2">
                        <span className="text-[16px] font-medium text-neutral-first">
                            {t('attached_documents')}
                        </span>
                        <Image
                            src="/images/changerequest/attached_doc_icon.png"
                            alt="Attached documents"
                            width={14}
                            height={14}
                            className="ml-1 mb-1"
                        />
                    </div>
                    <div className="flex flex-col gap-2 font-normal text-neutral-first/50 text-[16px] border-l border-secondary-second pl-6">
                        {documents.slice(0, 3).map((doc, index) => (
                            <span
                                key={index}
                                onClick={() => window.open(doc.document_url, '_blank', 'noopener,noreferrer')}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {doc.document_label}
                                <Image
                                    src="/images/common/arrow_next_01.png"
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

                <div className="space-y-2 text-[16px]">
                    <div className="pl-6 flex items-center gap-0 leading-none invisible">
                        <span className="text-lg font-semibold"> Empty </span>
                    </div>

                    <div className="border-l border-secondary-second pl-6">
                        <div className="flex flex-col gap-2 invisible">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-4 border-t border-secondary-second" />

            <div className="flex items-center justify-between">
                <button
                    onClick={onViewDetails}
                    className="text-[14px] text-neutral-first font-normal flex items-center gap-2 opacity-60 hover:opacity-100 transition"
                >
                    {t('view_details')}
                    <Image
                        src="/images/common/arrow_next_01.png"
                        alt="arrow"
                        width={14}
                        height={14}
                    />
                </button>
            </div>
        </div>
    );
}
