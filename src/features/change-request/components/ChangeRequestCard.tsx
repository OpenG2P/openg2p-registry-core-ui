import ViewAll from "@/components/shared/ViewAll";
import { useFetch } from "@/shared/hooks/useFetch";
import { ResponseBody } from "@/shared/types/backend-api";
import Image from "next/image";

interface Props {
    registerId: string;
    internalRecordId: string;
    type: string;
    activeTabId?: string;
}

export default function ChangeRequestCard({
    type,
    registerId,
    internalRecordId,
    activeTabId,
}: Props) {
    const { data, loading } = useFetch<ResponseBody>({
        url: `/api/change_request/pending`,
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
        (
            data?.response_payload as
            | { number_of_pending_change_logs: number }
            | undefined
        )?.number_of_pending_change_logs ?? 0;

    const params = new URLSearchParams();
    if (activeTabId) params.set("tab", activeTabId);

    const href = `/register/${type}/${internalRecordId}/change-request${params.toString() ? `?${params.toString()}` : ""
        }`;

    if (loading) {
        return (
            <div className="rounded-[30px] bg-[#EDC227] px-8 pt-5 pb-8 text-sm">
                Loading change requests...
            </div>
        );
    }

    return (
        <div className="relative rounded-[30px] bg-[#EDC227] px-8 pt-5 pb-8 overflow-hidden">
            <div className="flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-black leading-none">
                    Change Request
                </h3>
                <div className="flex h-[60px] w-20 items-center justify-center rounded-[20px] border-3 border-white bg-[#F2BA1A] text-[34px] font-bold text-black">
                    {count}
                </div>
            </div>

            <p className="mt-3 text-xs text-black/70">
                {count > 0
                    ? "Pending changes awaiting review"
                    : "No pending change requests"}
            </p>

            <div className="mt-25">
                <ViewAll href={href} bgColor="#D9D9D9" label="Know More" />
                <Image
                    src="/CR.png"
                    alt="Change Request"
                    width={164}
                    height={164}
                    className="absolute bottom-0 right-2"
                />
            </div>
        </div>
    );
}
