"use client";

import type { DeduplicationResult } from "@/features/change-request/types";

interface Props {
    results: DeduplicationResult[];
    loading: boolean;
    type: "change-request" | "register";
    t: (key: string) => string;
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-black">
            <span className="text-black/50 text-[16px]">{label}: </span>
            <span className="font-medium text-[14px]">{value}</span>
        </div>
    );
}

export default function DeduplicationCard({ results, loading, type, t }: Props) {
    return (
        <div className="flex flex-col gap-4">
            {loading ? (
                <div className="rounded-[10px] bg-white border border-gray-100 px-10 py-8">
                    <p className="text-black/50 text-sm">{t("loading")}</p>
                </div>
            ) : !results.length ? (
                <div className="rounded-[10px] bg-white border border-gray-100 px-10 py-8">
                    <p className="text-black/50 text-sm">{t("noDuplicatesFound")}</p>
                </div>
            ) : (
                results.map((result: DeduplicationResult, index: number) => {
                    const candidateId =
                        type === "change-request"
                            ? result.candidate_change_request_id
                            : result.internal_record_id;

                    const fields = Object.entries(result.field_matches);

                    return (
                        <div key={result.dedup_result_id} className="rounded-[10px] bg-white border border-gray-100 px-10 py-8">
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-4 text-[16px] text-[#00000080]">
                                <div className="space-y-4">
                                    <h3 className="text-[18px] font-semibold text-[#ED7C22]">
                                        {t("match")} #{index + 1}
                                    </h3>
                                    <div className="space-y-2">
                                        <KeyValue label={t("match_score")} value={`${result.match_score}%`} />
                                        <KeyValue label={t("dedup_result_id")} value={result.dedup_result_id} />
                                        {candidateId && (
                                            <KeyValue
                                                label={t(type === "change-request" ? "candidate_change_request_id" : "internal_record_id")}
                                                value={candidateId}
                                            />
                                        )}
                                    </div>
                                </div>

                                {fields.map(([fieldKey, match]) => (
                                    <div key={fieldKey} className="border-l-2 border-[#D9D9D9] pl-6 space-y-4">
                                        <h3 className="text-[18px] font-semibold text-[#ED7C22]">
                                            {t(fieldKey)}
                                        </h3>
                                        <div className="space-y-2">
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
                        </div>
                    );
                })
            )}
        </div>
    );
}
