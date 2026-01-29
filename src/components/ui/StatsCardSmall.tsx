"use client";

import { useMemo } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { useTranslations } from 'next-intl';
import Image from "next/image";

interface StatsCardSmallProps {
  stats_endpoint: string;
  active?: boolean;
}

const StatsCardSmall = ({
  stats_endpoint,
  active = false,
}: StatsCardSmallProps) => {
  const t = useTranslations();
  const { data, loading, error } = useFetch<any>({
    url: stats_endpoint,
  });

  const { title, rows } = useMemo(() => {
    if (!data) return { title: t('items'), rows: [] };

    if (Array.isArray(data)) {
      return {
        title: t('registers'),
        rows: data.slice(0, 2).map((item) => ({
          id: item.register_id,
          label: t(item.register_subject),
          value: item.total_record_count,
          imageUrl: item.register_icon?.startsWith('data:') ? item.register_icon : undefined,
        })),
      };
    }

    if (stats_endpoint.includes("change")) {
      return {
        title: t('changeRequests'),
        rows: [
          {
            id: "approved",
            label: t('approved'),
            value: data.approved_count,
            imageUrl: "/statsIcon/approved.png",
          },
          {
            id: "pending",
            label: t('pending'),
            value: data.pending_count,
            imageUrl: "/statsIcon/pending.png",
          },
        ],
      };
    }
    if (stats_endpoint.includes("incoming")) {
      return {
        title: t('incomingMessages'),
        rows: [
          {
            id: "models",
            label: t('dataModels'),
            value: data.no_of_data_models,
            imageUrl: "/statsIcon/data_models.png",
          },
          {
            id: "partners",
            label: t('partners'),
            value: data.no_of_partners,
            imageUrl: "/statsIcon/partners.png",
          },
        ],
      };
    }

    if (stats_endpoint.includes("outgoing")) {
      return {
        title: t('outgoingMessages'),
        rows: [
          {
            id: "topics",
            label: t('topics'),
            value: data.topics,
            imageUrl: "/statsIcon/topics.png",
          },
          {
            id: "models",
            label: t('dataModels'),
            value: data.data_models,
            imageUrl: "/statsIcon/data_models.png",
          },
        ],
      };
    }

    return { title: t('items'), rows: [] };
  }, [data, stats_endpoint, t]);

  const totalCount = useMemo(() => {
    // For registers, just count how many registers
    if (stats_endpoint.includes("register")) {
      return data?.length || 0;
    }
    if (stats_endpoint.includes("change")) {
      return data?.total_count || 0;
    }
    if (stats_endpoint.includes("incoming")) {
      return data?.no_of_messages || 0;
    }
    if (stats_endpoint.includes("outgoing")) {
      return data?.no_of_messages || 0;
    }
  }, [data, stats_endpoint]);

  return (
    <div
      className={`
        flex flex-col justify-between  transition-all duration-200
        w-full h-45 rounded-[30px] px-6 py-4
        ${active
          ? "border-black bg-black text-white"
          : "bg-[#E1E1E1] text-[#A1A1A1]"
        }
      `}
    >
      <div className="pointer-events-none">
        {/* count and title */}
        <div className="mb-4">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-12.5 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-7 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
          ) : (
            <>
              <h2 className="font-roboto text-[50px] font-bold leading-none">
                {totalCount}
              </h2>
              <h3 className="font-roboto text-[16px] font-medium leading-7">
                {title}
              </h3>
            </>
          )}
        </div>


        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-6 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{t('failedToLoad')}</p>
        ) : (
          // items
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                {row.imageUrl && (
                  <Image
                    src={row.imageUrl}
                    width={18}
                    height={18}
                    alt=""
                    className={active ? "invert" : ""}
                  />
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
