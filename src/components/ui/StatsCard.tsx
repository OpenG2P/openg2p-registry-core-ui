'use client';

import { useMemo } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { ResponseBody } from "@/shared/types/backend-api";

interface StatsCardProps {
  stats_endpoint: string;
  active?: boolean;
}

interface StatItem {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  total_record_count: number;
}

const StatsCard = ({ stats_endpoint, active }: StatsCardProps) => {
  const { data, loading, error } = useFetch<ResponseBody>({
    url: stats_endpoint,
    deps: [stats_endpoint],
  });

  const statLabel = useMemo(() => {
    if (stats_endpoint.includes("register")) return "Registers";
    if (stats_endpoint.includes("change")) return "Change Requests";
    if (stats_endpoint.includes("incoming")) return "Incoming Messages";
    if (stats_endpoint.includes("outgoing")) return "Outgoing Messages";
    return "Items";
  }, [stats_endpoint]);

  const items = (data?.response_payload as StatItem[]) ?? [];

  return (
    <div
      className={`
        flex h-48 w-[225px] flex-col justify-between rounded-3xl
        border-4 px-7 py-6 text-left
        ${
          active
            ? "border-black bg-black text-white"
            : "border-gray-200 bg-white text-gray-900"
        }
      `}
    >
      <div className="pointer-events-none">
        <h2 className="mb-4 text-xl font-bold leading-tight">
          {items.length} {statLabel}
        </h2>

        {loading ? (
          <p className="text-sm opacity-70">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Failed to load stats</p>
        ) : (
          <ul className="space-y-1 text-base leading-relaxed">
            {items.map((item) => (
              <li
                key={item.register_id}
                className="flex justify-between font-semibold"
              >
                <span className="font-bold">
                  {item.total_record_count}
                </span>
                <span>{item.register_subject}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
