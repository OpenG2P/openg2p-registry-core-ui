import { useState, useEffect, useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { Verification } from "@/features/change-request/types/change-request";

export const useVerifications = (changeId: string) => {
    const [verifications, setVerifications] = useState<Verification[]>([]);

    const { data: verificationResp } = useFetch<any>({
        url: `/api/change_request/verification/list`,
        enabled: !!changeId,
        options: {
            method: "POST",
            body: JSON.stringify({ change_request_id: changeId }),
        },
    });

    const { execute: executeCreate } = useFetch<any>({
        url: `/api/change_request/verification/create`,
        enabled: false,
    });

    useEffect(() => {
        setVerifications([]);
    }, [changeId]);

    useEffect(() => {
        if (verificationResp?.verifications) {
            setVerifications(verificationResp.verifications);
        }
    }, [verificationResp]);

    const addVerification = useCallback(
        async (observation: string, isApproved: boolean) => {
            try {
                const result = await executeCreate(
                    `/api/change_request/verification/create`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            change_request_id: changeId,
                            verification_observations: observation,
                            is_approved: isApproved,
                        }),
                    }
                );

                const newVerification = result?.verification;

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