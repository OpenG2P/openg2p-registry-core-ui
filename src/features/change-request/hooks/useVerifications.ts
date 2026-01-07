import { useState, useEffect, useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { Verification } from "@/features/change-request/types/change-request";
import { createRequestBody, createPostOptions } from "@/features/change-request/utils/api";

export const useVerifications = (changeId: string) => {
    const [verifications, setVerifications] = useState<Verification[]>([]);

    const { data: verificationResp } = useFetch<any>({
        url: `/api/change_request/verification/list`,
        enabled: !!changeId,
        options: createPostOptions(
            createRequestBody({ change_log_id: changeId })
        ),
    });

    const { execute: executeCreate } = useFetch<any>({
        url: `/api/change_request/verification/create`,
        enabled: false,
    });

    useEffect(() => {
        if (verificationResp?.response_body?.response_payload?.verifications) {
            setVerifications(
                verificationResp.response_body.response_payload.verifications
            );
        }
    }, [verificationResp]);

    const addVerification = useCallback(
        async (observation: string, isApproved: boolean) => {
            try {
                const result = await executeCreate(
                    `/api/change_request/verification/create`,
                    createPostOptions(
                        createRequestBody({
                            change_log_id: changeId,
                            verification_observations: observation,
                            is_approved: isApproved,
                        })
                    )
                );

                const newVerification = result?.response_body?.response_payload;
                if (newVerification) {
                    setVerifications((prev) => [newVerification, ...prev]);
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error adding verification:", error);
                return false;
            }
        },
        [changeId, executeCreate]
    );

    return { verifications, addVerification };
};