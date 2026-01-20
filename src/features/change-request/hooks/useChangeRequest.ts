import { useFetch } from "@/shared/hooks/useFetch";
import { ChangeRequest } from "@/features/change-request/types/change-request";
import { createRequestBody, createPostOptions } from "@/features/change-request/utils/api";

export const useChangeRequest = (changeId: string) => {
    const { data, loading } = useFetch<any>({
        url: `/api/change_request/get`,
        enabled: !!changeId,
        options: createPostOptions(
            createRequestBody({ change_request_id: changeId })
        ),
    });

    const details: ChangeRequest | null = data?.response_payload;

    return { details, loading };
};
