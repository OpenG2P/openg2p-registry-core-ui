"use client";

import { useState } from "react";
import Image from "next/image";
import type { DeduplicationResult } from "@/features/change-request/types";

interface Props {
    results: DeduplicationResult[];
    loading: boolean;
    type: "change-request" | "register";
    t: (key: string) => string;
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-black font-normal leading-[26px]">
            <span className="text-black/50 text-[16px]">{label} : </span>
            <span className="text-black font-normal text-[16px]">{value}</span>
        </div>
    );
}

export default function DeduplicationCard({ results, loading, type, t }: Props) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="rounded-[10px] bg-white border border-gray-200 px-10 py-8">
                <p className="text-black/50 text-sm">{t("loading")}</p>
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className="rounded-[10px] bg-white border border-gray-200 px-10 py-8">
                <p className="text-black/50 text-sm">{t("noDuplicatesFound")}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {results.map((result: DeduplicationResult, index: number) => {
                const expanded = expandedIndex === index;

                const candidateId =
                    type === "change-request"
                        ? result.candidate_change_request_id
                        : result.internal_record_id;

                const allMetaItems: { label: string; value: string }[] = [
                    { label: t("dedup_result_id"), value: result.dedup_result_id },
                ];
                if (candidateId) {
                    allMetaItems.push({
                        label: t(type === "change-request" ? "candidate_change_request_id" : "internal_record_id"),
                        value: candidateId,
                    });
                }
                allMetaItems.push(
                    { label: t("match_score"), value: `${result.match_score}%` },
                    { label: t("created_at"), value: new Date(result.created_at).toLocaleDateString("en-GB") }
                );

                const leftMeta = allMetaItems.slice(0, 3);
                const rightMeta = allMetaItems.slice(3);
                const fields = Object.entries(result.field_matches);

                return (
                    <div
                        key={result.dedup_result_id}
                        className={`relative px-10 pt-8 pb-6 transition-all ease-in-out duration-200 ${expanded
                            ? "bg-[#F3E6BC] border border-dashed border-[#ED7C22] z-10 rounded-t-[10px]"
                            : "bg-white border border-gray-200 z-0 rounded-[10px]"
                            }`}
                    >
                        <h3 className="text-[20px] font-medium text-black mb-4 leading-none">
                            {t("match") + "  #" + String(index + 1).padStart(2, "0")}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-0">
                                {leftMeta.map((item) => (
                                    <KeyValue key={item.label} label={item.label} value={item.value} />
                                ))}
                            </div>
                            {rightMeta.length > 0 && (
                                <div className="space-y-0">
                                    {rightMeta.map((item) => (
                                        <KeyValue key={item.label} label={item.label} value={item.value} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={`mt-4 mb-2 border-t ${expanded ? "border-[#F2BA1A]" : "border-[#D9D9D9]"}`} />

                        {!expanded && fields.length > 0 && (
                            <button
                                onClick={() => setExpandedIndex(index)}
                                className="flex items-center gap-1 text-[14px] text-black/60 cursor-pointer"
                            >
                                View More <Image src="/images/common/right_arrow.png" alt="more" width={14} height={14} className="rotate-90 opacity-[0.5]" />
                            </button>
                        )}

                        {expanded && fields.length > 0 && (
                            <div className="absolute top-full left-[-1px] right-[-1px] z-20 bg-[#F3E6BC] border border-t-0 border-dashed border-[#ED7C22] rounded-b-[10px] px-10 pb-8">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    {fields.map(([fieldKey, match], i) => (
                                        <div
                                            key={fieldKey}
                                            className={`space-y-0 py-2 ${i === 2 ? "" : "pr-10"} ${i > 0 ? "pl-10" : ""}`}
                                        >
                                            <div className={i > 0 ? "pl-6" : ""}>
                                                <h4 className="text-[20px] font-medium text-black leading-none mb-1">
                                                    {t(fieldKey)}
                                                </h4>
                                            </div>
                                            <div className={`space-y-0 ${i > 0 ? " border-l border-[#F2BA1A] pl-6" : ""}`}>
                                                <KeyValue label={t("incoming")} value={match.incoming} />
                                                <KeyValue label={t("candidate")} value={match.candidate} />
                                                <KeyValue
                                                    label={t("similarity")}
                                                    value={`${(match.similarity * 100).toFixed(0)}% (${match.match_type})`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr className="border-t border-[#F2BA1A] mt-6 mb-4" />
                                <button
                                    onClick={() => setExpandedIndex(null)}
                                    className="flex items-center gap-1 text-[14px] text-black/60 cursor-pointer"
                                >
                                    View Less <Image src="/images/common/right_arrow.png" alt="less" width={14} height={14} className="-rotate-90 opacity-[0.5]" />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
