import { useFetch } from "@/shared/hooks/useFetch";
import { ChangeLogResponse } from "@/shared/types/change-log";

export function useChangeLogs(
    registerId: string,
    internalRecordId: string
) {
    return useFetch<ChangeLogResponse>({
        url:
            registerId && internalRecordId
                ? "/api/register/get_change_logs"
                : null,
        deps: [registerId, internalRecordId],
        enabled: !!registerId && !!internalRecordId,
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: registerId,
                internal_record_id: internalRecordId,
            }),
        },
    });
}
