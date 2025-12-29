'use client';

import { useMemo } from 'react';
import { useFetch } from '@/shared/hooks/useFetch';
import Image from 'next/image';

interface StatsCardLargeProps {
  stats_endpoint: string;
  active?: boolean;
}

const StatsCardLarge = ({
  stats_endpoint,
  active = false,
}: StatsCardLargeProps) => {
  const { data, loading, error } = useFetch<any>({
    url: stats_endpoint,
  });

  const { title, rows } = useMemo(() => {
    if (!data) return { title: 'Items', rows: [] };

    if (Array.isArray(data)) {
      return {
        title: 'Registers',
        rows: data.map((item) => ({
          id: item.register_id,
          label: item.register_subject,
          value: item.total_record_count,
          imageUrl: item.imageUrl,
        })),
      };
    }

    if (stats_endpoint.includes('change')) {
      return {
        title: 'Change Requests',
        rows: [
          { id: 'approved', label: 'Approved', value: data.approved, imageUrl: data.imageUrl },
          { id: 'pending', label: 'Pending', value: data.pending, imageUrl: data.imageUrl },
        ],
      };
    }

    return { title: 'Items', rows: [] };
  }, [data, stats_endpoint]);

  const totalCount = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div
      className={`
        flex justify-between border-4 transition-all duration-200
        w-full h-52 rounded-[40px] px-10 py-8
        ${active ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900'}
      `}
    >
      {/* left side */}
      <div className="flex flex-col justify-center">
        <div className="flex flex-col gap-1">
          <span className="font-roboto text-[85px] font-bold leading-none">
            {totalCount}
          </span>

          <span className="font-roboto text-[24px] font-bold leading-none">
            {title}
          </span>
        </div>
      </div>

        {/* right side */}
      <div className="flex flex-col justify-center space-y-2">
        {loading ? (
          <p className="text-[16px] opacity-70">Loading...</p>
        ) : error ? (
          <p className="text-[16px] text-red-500">Failed to load stats</p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 mb-0">
              {row.imageUrl && (
                <Image src={row.imageUrl} width={18} height={18} alt="" />
              )}
              <span className="font-roboto text-[16px] font-medium leading-[30px]">
                {row.value}
              </span>
              <span className="font-roboto text-[16px] font-medium leading-[30px] opacity-80">
                {row.label}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatsCardLarge;
