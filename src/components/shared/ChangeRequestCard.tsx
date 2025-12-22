'use client';

import ViewAll from "@/components/shared/ViewAll";
import { useFetch } from "@/shared/hooks/useFetch";
import { ResponseBody } from "@/shared/types/backend-api";

interface Props {
  registerId: string;
  internalRecordId: string;
}

export default function ChangeRequestCard({
  registerId,
  internalRecordId,
}: Props) {
  const { data, loading } = useFetch<ResponseBody>({
    url: registerId && internalRecordId
      ? "/api/register/get_number_of_pending_change_logs"
      : null,
    enabled: !!registerId && !!internalRecordId,
    options: {
      method: "POST",
      body: JSON.stringify({
        register_id: registerId,
        internal_record_id: internalRecordId,
      }),
    },
  });

  const count =
    (data?.response_payload as { number_of_pending_change_logs: number } | undefined)
      ?.number_of_pending_change_logs ?? 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4 text-sm">
        Loading change requests...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">
        Change Request <span className="font-bold">{count}</span>
      </h3>

      <div className="my-3 h-0.5 bg-gray-200" />

      {count > 0 ? (
        <p className="text-xs text-gray-600">
          Pending changes awaiting review
        </p>
      ) : (
        <p className="text-xs text-gray-400">
          No pending change requests
        </p>
      )}

      <ViewAll href="/register/change-requests" label="Know More" />
    </div>
  );
}
