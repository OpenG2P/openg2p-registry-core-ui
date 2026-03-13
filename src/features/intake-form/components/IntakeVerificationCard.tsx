'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    VerificationCard,
    VerificationForm
} from "@/features/change-request/components";
import { useVerifications } from "@/features/change-request/hooks";
import { IntakeSubmissionPayload } from "@/features/intake-form/types";

interface Props {
    submission?: IntakeSubmissionPayload | null;
    isPending: boolean;
}

export default function IntakeVerificationCard({ submission, isPending }: Props) {
    const t = useTranslations();
    const [showForm, setShowForm] = useState(false);

    // same as change request verifications but with intakeFormSubmissionId
    const {
        verifications,
        loadingVerifications,
        addVerification
    } = useVerifications(undefined, submission?.submission_id);

    console.log(verifications, "verifications**********************");

    return (
        <div className="rounded-lg space-y-4">
            <div className="bg-[#F2BA1A] px-6 py-4 rounded-[10px] flex justify-between items-center shadow-sm">
                <h4 className="text-[24px] font-semibold text-black">
                    {t("Verifications")}
                </h4>
                {isPending && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 text-[14px] px-4 py-1 rounded-[10px] bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                        <span>{t("Add")}</span>
                        <Image
                            src="/images/common/plus.png"
                            alt="Add"
                            width={12}
                            height={12}
                        />
                    </button>
                )}
            </div>

            {showForm && (
                <VerificationForm
                    onSubmit={async (obs, approved) => {
                        const success = await addVerification(obs, approved);
                        if (success) setShowForm(false);
                        return success;
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}

            <div className="space-y-3">
                {loadingVerifications ? (
                    <div className="py-4 text-center text-gray-500">Loading verifications...</div>
                ) : (
                    verifications.map((v) => (
                        <VerificationCard key={v.verification_id} verification={v} />
                    ))
                )}
            </div>
        </div>
    );
}
