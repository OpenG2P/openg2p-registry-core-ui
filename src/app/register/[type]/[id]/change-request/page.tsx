'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import ChangeLogList from '@/components/shared/ChangeLogList';
import { useFetch } from '@/shared/hooks/useFetch';
import { TabsResponse } from '@/shared/types';

export default function ChangeRequestPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { data: tabsData } = useFetch<TabsResponse>({
    url: `/api/register/${type}/tabs`,
  });

  useEffect(() => {
    if (!tabsData?.tabs?.length || !tabFromUrl) return;

    const idx = tabsData.tabs.findIndex(
      t => t.tab_id === tabFromUrl
    );

    if (idx >= 0) setActiveTabIndex(idx);
  }, [tabsData, tabFromUrl]);

  const activeTabId = useMemo(
    () => tabsData?.tabs?.[activeTabIndex]?.tab_id,
    [tabsData, activeTabIndex]
  );

  const { data: registers } = useFetch<any[]>({
    url: '/api/register/all',
  });

  const currentRegister = useMemo(
    () =>
      registers?.find(
        r => r.register_mnemonic.toLowerCase() === type.toLowerCase()
      ),
    [registers, type]
  );

  const breadcrumb = useMemo(() => {
    const activeTab = tabsData?.tabs?.[activeTabIndex];

    return [
      {
        label: currentRegister?.register_subject ?? 'Register',
        href: `/register/${type}`,
      },
      {
        label: `ID-${id}`,
        href: `/register/${type}/${id}`,
      },
      ...(activeTab
        ? [
          {
            label: activeTab.tab_label,
            href: `/register/${type}/${id}?tab=${activeTab.tab_id}`,
          },
        ]
        : []),
      {
        label: 'Change Request',
      },
    ];
  }, [currentRegister, tabsData, activeTabIndex, type, id]);

  const handleTabChange = useCallback(
    (index: number) => {
      const tabId = tabsData?.tabs?.[index]?.tab_id;
      if (!tabId) return;

      setActiveTabIndex(index);

      router.push(
        `/register/${type}/${id}/change-request?tab=${tabId}`
      );
    },
    [tabsData, router, type, id]
  );

  const { data, loading } = useFetch<any>({
    url: `/api/register/${type}/${id}/change_request/get/list`,
    enabled: !!id && !!type,
    options: {
      method: "POST",
      body: JSON.stringify({
        register_id: id,
      }),
    },
  });
  const logs = data?.change_logs ?? [];

  return (
    <RegisterTabsLayout
      breadcrumb={breadcrumb}
      tabs={tabsData}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    >
      <div className="bg-white rounded-lg p-4">
        {loading && (
          <p className="text-sm text-gray-500">
            Loading change logs…
          </p>
        )}

        {!loading && logs.length === 0 && (
          <p className="text-sm text-gray-400">
            No change requests found
          </p>
        )}

        {!loading && logs.length > 0 && (
          <ChangeLogList
            logs={logs}
            type={type}
            registerId={id}
          />
        )}
      </div>
    </RegisterTabsLayout>
  );
}
