'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RegisterTabsLayout } from '@/components/shared';
import { useFetch } from '@/shared/hooks/useFetch';
import { ChangeLogList } from '@/features/change-request/components';
import { ChangeRequest } from '@/features/change-request/types';
import {useLocale} from 'next-intl'

import { TabsResponse } from '@/shared/types';

export default function ChangeRequestPage() {
  const locale = useLocale()
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

  const logs: ChangeRequest[] =
    data?.response_body?.response_payload?.change_requests ?? [];


  return (
    <RegisterTabsLayout
      breadcrumb={breadcrumb}
      tabs={tabsData}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    >
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400">No change requests found</p>
      ) : (
        <ChangeLogList
          logs={logs}
          getDetailsUrl={log =>
            `/${locale}/register/${type}/${id}/change-request/${log.change_request_id}`
          }
        />
      )}
    </RegisterTabsLayout>
  );
}
