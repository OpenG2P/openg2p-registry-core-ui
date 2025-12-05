"use client";

import React, { useEffect, useState } from "react";

interface StatsCardProps {
  api_endpoint: string;
  active?: boolean;
}


const StatsCard = ({ api_endpoint, active }: StatsCardProps) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(api_endpoint);
        const data = await res.json();

        setTitle(data.title || "");
        setItems(data.items || []);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [api_endpoint]);

  return (
    <div
      className={`flex h-48 w-[225px] flex-col justify-between rounded-3xl border px-7 py-6 text-left transition-all duration-200 ${
        active
          ? "border-black bg-black text-white "
          : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
      }`}
    >
      <div>
        <h2 className="mb-4 text-xl font-bold leading-tight">{title}</h2>

        {loading ? (
          <p className="text-sm opacity-70">Loading...</p>
        ) : (
          <ul className="space-y-1 text-base leading-relaxed">
            {items.map((line, idx) => (
              <li key={idx} className="font-semibold">
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
