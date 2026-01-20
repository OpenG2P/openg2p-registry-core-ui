'use client';

import ViewAll from "@/components/shared/ViewAll";
import { useFetch } from "@/shared/hooks/useFetch";
import { useLocale } from "next-intl";
import Image from "next/image";

interface Props {
    type: string;
    registerId: string;
    internalRecordId: string;
    activeTabId?: string;
}

export default function VersionHistoryCard({
    type,
    registerId,
    internalRecordId,
    activeTabId
}: Props) {
    const locale = useLocale();

    const { data, loading } = useFetch<any>({
        url: `/api/register/versions`,
        enabled: !!registerId && !!internalRecordId && !!activeTabId,
        options: {
            method: "POST",
            body: JSON.stringify({
                register_id: registerId,
                internal_record_id: internalRecordId,
                tab_id: activeTabId
            }),
        },
    });

    const payload =
        data as
        | {
            number_of_versions: number;
            last_updated_by: string;
            last_updated_at: string;
            last_approved_by?: string;
            last_approved_at?: string;
        }
        | undefined;

    if (loading) {
        return (
            <div className="relative rounded-[30px] bg-[#E0E0E0] px-8 pt-5 pb-8 overflow-hidden animate-pulse">
                <div className="flex items-center justify-between mb-5">
                    <div className="h-6 w-40 rounded bg-black/20" />
                    <div className="h-15 w-20 rounded-[20px] bg-black/20" />
                </div>

                <div className="space-y-3">
                    <div className="h-4 w-32 rounded bg-black/20" />
                    <div className="h-4 w-64 rounded bg-black/20" />
                </div>

                <div className="mt-4 space-y-3">
                    <div className="h-4 w-32 rounded bg-black/20" />
                    <div className="h-4 w-64 rounded bg-black/20" />
                </div>

                <div className="mt-6 h-10 w-32 rounded-full bg-black/20" />
            </div>
        );
    }

    if (!payload) return null;

    const params = new URLSearchParams();
    if (activeTabId) params.set("tab", activeTabId);

    const href = `/${locale}/register/${type}/${internalRecordId}/version-history${params.toString() ? `?${params.toString()}` : ""
        }`;

    return (
        <div className="relative rounded-[30px] bg-[#E0E0E0] px-8 pt-5 pb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[24px] font-semibold text-black leading-none">
                    Version History
                </h3>
                <div className="flex h-15 w-20 items-center justify-center rounded-[20px] border-3 border-white bg-[#D9D9D9] text-[34px] font-bold text-black">
                    {payload.number_of_versions}
                </div>
            </div>

            <div className="space-y-1 text-[16px] text-black">
                <p className="font-medium">Last Updated by</p>
                <div className="flex items-center gap-2">
                    <Image
                        src="/version_profile.png"
                        alt="Updated by"
                        width={16}
                        height={16}
                        className="rounded-full"
                    />
                    <span>{payload.last_updated_by}</span>
                    <Image
                        src="/version_calendar.png"
                        alt="Date"
                        width={14}
                        height={14}
                        className="ml-2"
                    />
                    <span>
                        {new Date(payload.last_updated_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {payload.last_approved_by && payload.last_approved_at && (
                <div className="mt-4 space-y-1 text-[16px] text-black">
                    <p className="font-medium">Last Approved by</p>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/version_profile.png"
                            alt="Approved by"
                            width={16}
                            height={16}
                            className="rounded-full"
                        />
                        <span>{payload.last_approved_by}</span>
                        <Image
                            src="/version_calendar.png"
                            alt="Date"
                            width={14}
                            height={14}
                            className="ml-2"
                        />
                        <span>
                            {new Date(payload.last_approved_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )}
            <ViewAll
                href={href}
                bgColor="#B0B0AD"
                label="Know More"
            />
        </div>
    );
}
