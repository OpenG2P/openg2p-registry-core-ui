"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { RegisterTabsLayout } from "@/components/shared";
import { useFetch } from "@/shared/hooks/useFetch";

type Verification = {
  verification_id: string;
  verified_by: string;
  verified_at: string;
  verification_observations: string;
  is_approved: boolean;
};

export default function ChangeRequestDetailsPage() {
  const { type, id, changeId } = useParams<{
    type: string;
    id: string;
    changeId: string;
  }>();

  const [activeValueTab, setActiveValueTab] = useState<"old" | "new">("new");
  const [showAddVerification, setShowAddVerification] = useState(false);

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [observation, setObservation] = useState("");
  const [isApproved, setIsApproved] = useState(true);


  const { data, loading } = useFetch<any>({
    url: `/api/register/${type}/${id}/change_request/get`,
    enabled: !!changeId,
    options: {
      method: "POST",
      body: JSON.stringify({
        request_body: {
          request_payload: {
            change_log_id: changeId,
          },
        },
      }),
    },
  });

  const details = data?.response_body?.response_payload;

  const { data: registers } = useFetch<any[]>({
    url: '/api/register/all',
  });

  const currentRegister = useMemo(
    () =>
      registers?.find(
        r => r.register_mnemonic.toLowerCase() === type.toLowerCase()
      ),
    [registers, type]
  );

  const breadcrumb = useMemo(
    () => [
      { label: currentRegister?.register_subject ?? 'Register', href: `/register/${type}` },
      { label: `ID-${id}`, href: `/register/${type}/${id}` },
      { label: "Change Request", href: `/register/${type}/${id}/change-request` },
      { label: `${changeId}` },
    ],
    [type, id, changeId]
  );

  const { data: verificationResp } = useFetch<any>({
    url: `/api/register/${type}/${id}/change_request/verification/list`,
    enabled: !!changeId,
    options: {
      method: "POST",
      body: JSON.stringify({
        request_header: { request_id: crypto.randomUUID() },
        request_body: {
          request_payload: { change_log_id: changeId },
        },
      }),
    },
  });

  useEffect(() => {
    if (verificationResp?.response_body?.response_payload?.verifications) {
      setVerifications(
        verificationResp.response_body.response_payload.verifications
      );
    }
  }, [verificationResp]);

  const handleAddVerification = async () => {
    const res = await fetch(
      `/api/register/${type}/${id}/change_request/verification/create`,
      {
        method: "POST",
        body: JSON.stringify({
          request_header: { request_id: crypto.randomUUID() },
          request_body: {
            request_payload: {
              change_log_id: changeId,
              verification_observations: observation,
              is_approved: isApproved,
            },
          },
        }),
      }
    );

    const json = await res.json();
    const newVerification =
      json?.response_body?.response_payload;

    if (newVerification) {
      setVerifications(prev => [newVerification, ...prev]);
      setObservation("");
      setIsApproved(true);
      setShowAddVerification(false);
    }
  };

  return (
    <RegisterTabsLayout breadcrumb={breadcrumb}>
      {loading && (
        <p className="text-sm text-gray-500">Loading change request…</p>
      )}

      {!loading && details && (
        <div className="flex gap-4">
          <div className="w-full lg:w-[70%]">
            <div className="border rounded-lg p-4 bg-white flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                <div className="space-y-1 text-sm">
                  <div className="font-semibold">
                    Change ID: {details.change_log_id}
                  </div>
                  <div>
                    Status:{" "}
                    <span className="font-medium">
                      {details.approval_status}
                    </span>
                  </div>
                  <div>
                    Change Date:{" "}
                    <span className="font-medium">
                      {new Date(details.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div>
                    Verification Required:{" "}
                    <span className="font-medium">
                      {details.no_of_verifications_required}
                    </span>
                  </div>
                  <div>
                    Verification Done:{" "}
                    <span className="font-medium">
                      {details.no_of_verifications_done}
                    </span>
                  </div>
                  <div>
                    Docs Uploaded:{" "}
                    <span className="font-medium">
                      {details.documents?.length ?? 0}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="font-medium text-gray-700">
                    Documents
                  </div>

                  {(!details.documents || details.documents.length === 0) && (
                    <div className="text-gray-400 text-xs">
                      No documents
                    </div>
                  )}

                  {details.documents?.map((doc: any) => (
                    <div
                      key={doc.doc_id}
                      className="text-blue-600 cursor-pointer hover:underline"
                    >
                      {doc.doc_name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium rounded-md
          bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Reject
                </button>

                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium rounded-md
          bg-gray-900 text-white hover:bg-black transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>


          <div className="w-full lg:w-[30%]">
            <div className="rounded-lg space-y-4">
              <div className="flex justify-between border p-4 rounded-lg items-center">
                <h4 className="text-sm font-semibold">Verifications</h4>
                <button
                  onClick={() => setShowAddVerification(v => !v)}
                  className="text-sm px-3 py-1 rounded-md bg-gray-900 text-white"
                >
                  Add
                </button>
              </div>

              {showAddVerification && (
                <div className="border rounded-lg p-3 space-y-2 bg-gray-50">
                  <textarea
                    value={observation}
                    onChange={e => setObservation(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                    placeholder="Verification observations"
                  />

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isApproved}
                      onChange={e => setIsApproved(e.target.checked)}
                    />
                    Approved
                  </label>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowAddVerification(false)}
                      className="px-3 py-1 text-sm border rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddVerification}
                      className="px-3 py-1 text-sm rounded-md bg-green-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {verifications.map(v => (
                  <div
                    key={v.verification_id}
                    className="border rounded-lg p-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{v.verified_by}</span>
                      <span
                        className={`text-xs font-medium ${v.is_approved ? 'text-green-600' : 'text-red-600'
                          }`}
                      >
                        {v.is_approved ? 'Approved' : 'Rejected'}
                      </span>
                    </div>

                    <div className="text-gray-500 text-xs">
                      {new Date(v.verified_at).toLocaleString()}
                    </div>

                    <div className="mt-1 text-gray-700">
                      {v.verification_observations}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </RegisterTabsLayout>
  );
}