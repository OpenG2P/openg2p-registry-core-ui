'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import { useFetch } from '@/shared/hooks/useFetch';
import { ChangeLogList } from '@/features/change-request/components';
import { ChangeLog } from '@/features/change-request/types';

interface TabConfig {
  'tab-id': string;
  'tab-label': string;
  order: number;
}

interface TabsApiResponse {
  tabs: TabConfig[];
}

export default function ChangeRequestPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { data: tabsData } = useFetch<TabsApiResponse>({
    url: `/api/register/${type}/tabs`,
  });

  useEffect(() => {
    if (!tabsData?.tabs || !tabFromUrl) return;
    const idx = tabsData.tabs.findIndex(t => t['tab-id'] === tabFromUrl);
    if (idx >= 0) setActiveTabIndex(idx);
  }, [tabsData, tabFromUrl]);

  const activeTabId = tabsData?.tabs?.[activeTabIndex]?.['tab-id'];

  const { data, loading } = useFetch<any>({
    url: `/api/change_request/get/list`,
    enabled: !!activeTabId,
    options: {
      method: 'POST',
      body: JSON.stringify({
        request_body: {
          pagination_request: {
            current_page: 1,
            page_size: 10,
            sort_by: '',
            filter_by: '',
          },
          request_payload: {
            subject_register_id: id,
            subject_record_id: id,
            tab_id: activeTabId,
          },
        },
      }),
    },
  });

  const logs: ChangeLog[] =
      data?.response_body?.response_payload?.change_requests ?? [];


  const breadcrumb = useMemo(
    () => [
      { label: 'Register', href: `/register/${type}` },
      { label: `ID-${id}`, href: `/register/${type}/${id}` },
      { label: 'Change Request' },
    ],
    [type, id]
  );

  const onTabChange = useCallback(
    (index: number) => {
      const tabId = tabsData?.tabs?.[index]?.['tab-id'];
      if (!tabId) return;
      setActiveTabIndex(index);
      router.push(`/register/${type}/${id}/change-request?tab=${tabId}`);
    },
    [tabsData, router, type, id]
  );

  return (
    <RegisterTabsLayout
      breadcrumb={breadcrumb}
      tabs={tabsData}
      activeTab={activeTabIndex}
      onTabChange={onTabChange}
    >
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400">No change requests found</p>
      ) : (
        <ChangeLogList
          logs={logs}
          getDetailsUrl={log =>
            `/register/${type}/${id}/change-request/${log.change_request_id}`
          }
        />
      )}
    </RegisterTabsLayout>
  );
}
