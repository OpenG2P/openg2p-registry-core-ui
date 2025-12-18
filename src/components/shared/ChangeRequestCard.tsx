"use client";

import { useEffect } from "react";
import ViewAll from "@/components/shared/ViewAll";
import { useFetch } from "@/shared/hooks/useFetch";

interface Props {
    registerId: string;
    internalRecordId: string;
}

interface ChangeLogResponse {
    response_body: {
        response_payload: {
            number_of_pending_change_logs: number;
        };
    };
}

export default function ChangeRequestCard({
    registerId,
    internalRecordId
}: Props) {
    const { data, execute, loading } = useFetch<ChangeLogResponse>();

    useEffect(() => {
        execute("/api/register/get_number_of_pending_change_logs", {
            method: "POST",
            body: JSON.stringify({
                register_id: registerId,
                internal_record_id: internalRecordId,
            }),
        });
    }, [registerId, internalRecordId, execute]);

    const count =
        data?.response_body.response_payload.number_of_pending_change_logs ?? 0;

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
