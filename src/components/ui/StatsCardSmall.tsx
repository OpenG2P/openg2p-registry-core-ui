"use client";

import { useMemo } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import Image from "next/image";

interface StatsCardSmallProps {
  stats_endpoint: string;
  active?: boolean;
}

const StatsCardSmall = ({
  stats_endpoint,
  active = false,
}: StatsCardSmallProps) => {
  const { data, loading, error } = useFetch<any>({
    url: stats_endpoint,
  });

  const { title, rows } = useMemo(() => {
    if (!data) return { title: "Items", rows: [] };

    if (Array.isArray(data)) {
      return {
        title: "Registers",
        rows: data.slice(0, 2).map((item) => ({
          id: item.register_id,
          label: item.register_subject,
          value: item.total_record_count,
          imageUrl: item.imageUrl,
        })),
      };
    }

    if (stats_endpoint.includes("change")) {
      return {
        title: "Change Requests",
        rows: [
          {
            id: "approved",
            label: "Approved",
            value: data.approved,
            imageUrl: data.imageUrl,
          },
          {
            id: "pending",
            label: "Pending",
            value: data.pending,
            imageUrl: data.imageUrl,
          },
        ],
      };
    }

    if (stats_endpoint.includes("incoming")) {
      return {
        title: "Incoming Messages",
        rows: [
          {
            id: "partners",
            label: "Partners",
            value: data.partners,
            imageUrl: data.imageUrl,
          },
          {
            id: "models",
            label: "Data Models",
            value: data.data_models,
            imageUrl: data.imageUrl,
          },
        ],
      };
    }

    if (stats_endpoint.includes("outgoing")) {
      return {
        title: "Outgoing Messages",
        rows: [
          {
            id: "topics",
            label: "Topics",
            value: data.topics,
            imageUrl: data.imageUrl,
          },
          {
            id: "models",
            label: "Data Models",
            value: data.data_models,
            imageUrl: data.imageUrl,
          },
        ],
      };
    }

    return { title: "Items", rows: [] };
  }, [data, stats_endpoint]);

  const totalCount = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div
      className={`
        flex flex-col justify-between  transition-all duration-200
        w-full h-auto rounded-[44px] px-6 py-5
        ${active
          ? "border-black bg-black text-white"
          : "bg-[#E1E1E1] text-[#A1A1A1]"
        }
      `}
    >
      <div className="pointer-events-none">
        {/* ocunt and tittle */}
        <div className="mb-4">
          <h2 className="font-roboto text-[50px] font-bold leading-none">
            {totalCount}
          </h2>
          <h3 className="font-roboto text-[16px] font-medium leading-7">
            {title}
          </h3>
        </div>

        {loading ? (
          <p className="text-sm opacity-70">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Failed to load stats</p>
        ) : (
          // items
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                {row.imageUrl && (
                  <Image src={row.imageUrl} width={16} height={16} alt="" />
                )}

                {/* value */}
                <span className="font-roboto text-[16px] font-bold leading-7">
                  {row.value}
                </span>

                {/* label */}
                <span className="font-roboto text-[16px] font-medium leading-7 opacity-80">
                  {row.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StatsCardSmall;
