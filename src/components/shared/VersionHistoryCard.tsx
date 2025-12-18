"use client";

import { useEffect } from "react";
import ViewAll from "@/components/shared/ViewAll";
import { useFetch } from "@/shared/hooks/useFetch";

interface Props {
  registerId: string;
  internalRecordId: string;
}

interface VersionResponse {
  response_body: {
    response_payload: {
      number_of_versions: number;
      last_updated_by: string;
      last_updated_at: string;
      last_approved_by?: string;
      last_approved_at?: string;
    };
  };
}

export default function VersionHistoryCard({
  registerId,
  internalRecordId,
}: Props) {
  const { data, execute, loading } = useFetch<VersionResponse>();

  useEffect(() => {
    execute("/api/register/get_number_of_versions", {
      method: "POST",
      body: JSON.stringify({
        register_id: registerId,
        internal_record_id: internalRecordId,
      }),
    });
  }, [registerId, internalRecordId, execute]);

  const payload = data?.response_body.response_payload;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4 text-sm">
        Loading version history...
      </div>
    );
  }

  if (!payload) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">
        Version History{" "}
        <span className="font-bold">{payload.number_of_versions}</span>
      </h3>

      <div className="my-3 h-0.5 bg-gray-200" />

      <div className="text-xs text-gray-600 space-y-2">
        <p>Latest update to this record</p>

        <p>
          <span className="font-medium">Updated:</span>{" "}
          {new Date(payload.last_updated_at).toLocaleString()}
        </p>

        <p>
          <span className="font-medium">Updated by:</span>{" "}
          {payload.last_updated_by}
        </p>

        {payload.last_approved_at && payload.last_approved_by && (
          <>
            <p>
              <span className="font-medium">Approved:</span>{" "}
              {new Date(payload.last_approved_at).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Approved by:</span>{" "}
              {payload.last_approved_by}
            </p>
          </>
        )}
      </div>

      <ViewAll href="/register/version-history" label="Know More" />
    </div>
  );
}
