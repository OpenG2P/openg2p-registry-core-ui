'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import { RegisterPageLayout } from "@/components/shared";
import { useChangeLogs } from "@/shared/hooks/useChangeLogs";
import ChangeLogList from "@/components/shared/ChangeLogList";

const DUMMY_TABS = [{ label: "Tab 1" }, { label: "Tab 2" }, { label: "Tab 3" }];

const STATUS_MAP = ["PENDING", "APPROVED", "REJECTED"] as const;

export default function ChangeLogPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [activeTab, setActiveTab] = useState(0);

  const breadcrumb = [
    { label: "Registers", href: `/register/${type}` },
    { label: "Record", href: `/register/${type}/${id}` },
    { label: "Change Log" },
  ];

  const status = STATUS_MAP[activeTab];

  const { data, loading } = useChangeLogs(
    type,
    id,
  );

const logs = data?.change_logs ?? [];


  return (
    <RegisterPageLayout
      breadcrumb={breadcrumb}
      tabs={DUMMY_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="bg-white rounded-lg border p-4">
        {loading && (
          <p className="text-sm text-gray-500">Loading change logs…</p>
        )}

        {!loading && logs.length === 0 && (
          <p className="text-sm text-gray-400">No change logs found</p>
        )}

        {!loading && logs.length > 0 && (
          <ChangeLogList logs={logs} />
        )}
      </div>
    </RegisterPageLayout>
  );
}
