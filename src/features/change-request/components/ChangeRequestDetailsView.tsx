"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RegisterTabsLayout } from "@/components/shared";
import { useFetch } from "@/shared/hooks/useFetch";
import { Verification } from "@/features/change-request/types";


interface Props {
    changeId: string;
    breadcrumb: { label: string; href?: string }[];
}

export default function ChangeRequestDetailsView({ changeId, breadcrumb }: Props) {
    const [showAddVerification, setShowAddVerification] = useState(false);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [observation, setObservation] = useState("");
    const [isApproved, setIsApproved] = useState(true);

    const { data, loading } = useFetch<any>({
        url: `/api/change_request/get`,
        enabled: !!changeId,
        options: {
            method: "POST",
            body: JSON.stringify({
                request_body: { request_payload: { change_log_id: changeId } },
            }),
        },
    });

    const details = data?.response_body?.response_payload?.change_request;

    const { data: verificationResp } = useFetch<any>({
        url: `/api/change_request/verification/list`,
        enabled: !!changeId,
        options: {
            method: "POST",
            body: JSON.stringify({
                request_body: { request_payload: { change_log_id: changeId } },
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
        const res = await fetch(`/api/change_request/verification/create`, {
            method: "POST",
            body: JSON.stringify({
                request_body: {
                    request_payload: {
                        change_log_id: changeId,
                        verification_observations: observation,
                        is_approved: isApproved,
                    },
                },
            }),
        });

        const json = await res.json();
        const newVerification = json?.response_body?.response_payload;

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
                <div className="flex gap-[30px]">
                    <div className="w-full lg:w-[75%]">
                        <div className="rounded-[25px] bg-[#F2BA1A33]/80 px-10 py-5 flex flex-col border border-dashed border-[#ED7C22]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 text-[16px] text-[#00000080]">
                                    <h3 className="text-lg font-semibold text-black">
                                        Change XYZ
                                    </h3>
                                    <div>
                                        Change ID:{" "}
                                        <span className="text-black font-medium">
                                            {details.change_request_id}
                                        </span>
                                    </div>
                                    <div>
                                        Status:{" "}
                                        <span className="font-medium text-red-500">
                                            {details.approval_status}
                                        </span>
                                    </div>
                                    <div>
                                        Change Date:{" "}
                                        <span className="text-black font-medium">
                                            {new Date(details.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-[16px] text-[#00000080]">
                                    <h3 className="text-lg font-semibold text-black invisible">
                                        Verification
                                    </h3>

                                    <div className="border-l-2 border-[#F2BA1A] pl-6 space-y-2">
                                        <div>
                                            No. of verification required:{" "}
                                            <span className="text-black font-medium">
                                                {details.no_of_verifications_required}
                                            </span>
                                        </div>

                                        <div>
                                            No. of verification done:{" "}
                                            <span className="text-black font-medium">
                                                {details.no_of_verifications_done}
                                            </span>
                                        </div>
                                        <div>
                                            No. of documents attached:{' '}
                                            <span className="text-black font-medium">10</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-[16px] text-[#00000080]">
                                    <div className="pl-6 flex items-center leading-none">
                                        <span className="text-lg font-semibold text-black">
                                            Attached Doc
                                        </span>
                                        <Image
                                            src="/attached_doc_icon.png"
                                            alt="doc"
                                            width={14}
                                            height={14}
                                            className="ml-1 mb-1"
                                        />
                                    </div>

                                    <div className="border-l-2 border-[#F2BA1A] pl-6 flex flex-col gap-2 font-semibold">
                                        {["Location Documents", "ID Card Documents", "Other Documents"].map(
                                            label => (
                                                <span key={label} className="flex items-center gap-2 cursor-pointer">
                                                    {label}
                                                    <Image
                                                        src="/right_arrow.png"
                                                        alt="arrow"
                                                        width={14}
                                                        height={14}
                                                    />
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="my-4 border-t-2 border-[#F2BA1A]" />

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-[14px] font-medium rounded-[20px] bg-white text-black/50"
                                >
                                    Reject Change
                                </button>

                                <button
                                    type="button"
                                    className="px-4 py-2 text-[14px] font-medium rounded-[20px] bg-black text-white"
                                >
                                    Approve Change
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="w-full lg:w-[25%]">
                        <div className="rounded-lg space-y-4">
                            <div className="flex justify-between bg-[#F2BA1A] px-6 py-4 rounded-[25px] items-center">
                                <h4 className="text-[24px] font-semibold">Verifications</h4>
                                <button
                                    onClick={() => setShowAddVerification(v => !v)}
                                    className="flex items-center gap-2 text-[14px] px-4 py-1 rounded-[17px] bg-black text-white"
                                >
                                    <span className="pt-0.5">Add</span>
                                    <Image
                                        src="/plus.png"
                                        alt="Add"
                                        width={12}
                                        height={12}
                                        className="pb-0.5"
                                    />
                                </button>
                            </div>

                            {showAddVerification && (
                                <div className="relative border border-[#F2BA1A] rounded-[25px] p-6 text-sm space-y-3 bg-white">
                                    <button
                                        onClick={() => setShowAddVerification(false)}
                                        className="absolute top-4 right-4"
                                    >
                                        <Image
                                            src="/close.png"
                                            alt="close"
                                            width={22}
                                            height={22}
                                            className="opacity-70 hover:opacity-100"
                                        />
                                    </button>

                                    <div className="font-semibold text-black/50">
                                        New Verification
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 relative">
                                            <Image
                                                src="/verified_person.png"
                                                alt="verified person"
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[20px] font-medium text-black">
                                                John Smith
                                                <span className="ml-2 text-[14px] text-black/50">You</span>
                                            </span>
                                            <span className="text-[14px] text-black/50">
                                                {new Date().toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[14px] font-medium text-black/50 mb-1">
                                            Message
                                        </div>
                                        <textarea
                                            value={observation}
                                            onChange={e => setObservation(e.target.value)}
                                            rows={1}
                                            placeholder="Type your message here..."
                                            className="w-full border border-black/25 rounded-md p-2 text-sm resize-none focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-3">
                                        <div className="flex items-center gap-6">
                                            <label
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => setIsApproved(true)}
                                            >
                                                <input type="checkbox" checked={isApproved} readOnly className="hidden" />
                                                <div
                                                    className={`w-6 h-6 border rounded flex items-center justify-center
                                                        ${isApproved ? "border-[#ED7C22]" : "border-gray-300"}
                                                    `}
                                                >
                                                    {isApproved && (
                                                        <Image
                                                            src="/tick.png"
                                                            alt="tick"
                                                            width={16}
                                                            height={16}
                                                        />
                                                    )}
                                                </div>

                                                <span className="text-gray-700">OK</span>
                                            </label>

                                            <label
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => setIsApproved(false)}
                                            >
                                                <input type="checkbox" checked={!isApproved} readOnly className="hidden" />

                                                <div
                                                    className={`w-6 h-6 border rounded flex items-center justify-center
                                                        ${!isApproved ? "border-[#ED7C22]" : "border-gray-300"}
                                                    `}
                                                >
                                                    {!isApproved && (
                                                        <Image
                                                            src="/tick.png"
                                                            alt="tick"
                                                            width={16}
                                                            height={16}
                                                        />
                                                    )}
                                                </div>
                                                <span className="text-gray-700">Not OK</span>
                                            </label>
                                        </div>


                                        <button
                                            onClick={handleAddVerification}
                                            className="px-4 py-1.5 text-sm rounded-xl bg-black text-white"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {verifications.map(v => (
                                    <div
                                        key={v.verification_id}
                                        className="bg-[#E0E0E0] rounded-[25px] p-6 space-y-3"
                                    >
                                        <div className="font-semibold text-[14px] text-black/50">
                                            Verified by
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 relative">
                                                <Image
                                                    src="/verified_person.png"
                                                    alt="verified person"
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[20px] font-medium text-black">
                                                    {v.verified_by}
                                                </span>
                                                <span className="text-[14px] text-black/50">
                                                    {new Date(v.verified_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-[14px] font-medium text-black/50 mb-1">
                                                Message
                                            </div>
                                            <div className="text-[16px] text-black">
                                                {v.verification_observations}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 pt-2">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <div
                                                    className={`w-6 h-6 border rounded flex items-center justify-center
                                                        ${v.is_approved
                                                            ? "border-[#ED7C22] bg-white"
                                                            : "border-gray-300 bg-white"}
                                                    `}
                                                >
                                                    {v.is_approved && (
                                                        <Image
                                                            src="/tick.png"
                                                            alt="tick"
                                                            width={16}
                                                            height={16}
                                                        />
                                                    )}
                                                </div>
                                                <span>OK</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-700">
                                                <div
                                                    className={`w-6 h-6 border rounded flex items-center justify-center
                                                        ${!v.is_approved
                                                            ? "border-[#ED7C22] bg-white"
                                                            : "border-gray-300 bg-white"}
                                                    `}
                                                >
                                                    {!v.is_approved && (
                                                        <Image
                                                            src="/tick.png"
                                                            alt="tick"
                                                            width={16}
                                                            height={16}
                                                        />
                                                    )}
                                                </div>
                                                <span>Not OK</span>
                                            </div>
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
