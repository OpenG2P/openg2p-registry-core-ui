'use client';

import { useMemo } from "react";
import { useFetch } from "@/shared/hooks/useFetch";

interface StatsCardProps {
  stats_endpoint: string;
  active?: boolean;
}


const StatsCard = ({ stats_endpoint, active }: StatsCardProps) => {
  const { data, loading, error } = useFetch<any>({
    url: stats_endpoint,
  });

  const { title, rows } = useMemo(() => {
    if (!data) return { title: "Items", rows: [] };

    /** Register stats */
    if (Array.isArray(data)) {
      return {
        title: "Registers",
        rows: data.map((item) => ({
          id: item.register_id,
          label: item.register_subject,
          value: item.total_record_count,
        })),
      };
    }

    /** Change request stats */
    if (stats_endpoint.includes("change")) {
      return {
        title: "Change Requests",
        rows: [
          { id: "approved", label: "Approved", value: data.approved },
          { id: "pending", label: "Pending", value: data.pending },
        ],
      };
    }

    /** Incoming message stats */
    if (stats_endpoint.includes("incoming")) {
      return {
        title: "Incoming Messages",
        rows: [
          { id: "partners", label: "Partners", value: data.partners },
          { id: "models", label: "Data Models", value: data.data_models },
        ],
      };
    }

    /** Outgoing message stats */
    if (stats_endpoint.includes("outgoing")) {
      return {
        title: "Outgoing Messages",
        rows: [
          { id: "topics", label: "Topics", value: data.topics },
          { id: "models", label: "Data Models", value: data.data_models },
        ],
      };
    }

    return { title: "Items", rows: [] };
  }, [data, stats_endpoint]);

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
          {rows.reduce((sum, r) => sum + r.value, 0)} {title}
        </h2>

        {loading ? (
          <p className="text-sm opacity-70">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Failed to load stats</p>
        ) : (
          <ul className="space-y-1 text-base leading-relaxed">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex justify-between font-semibold"
              >
                <span className="font-bold">{row.value}</span>
                <span>{row.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
