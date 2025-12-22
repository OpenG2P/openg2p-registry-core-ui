'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  BreadcrumbBar,
  ChangeRequestCard,
  VersionHistoryCard,
} from '@/components/shared';
import {
  WidgetProvider,
  UISchema,
  createWidgetStore,
  SectionsContainer,
  SectionChanges,
} from '@openg2p/registry-widgets';
import { useFetch } from '@/shared/hooks/useFetch';

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string | null;
}

interface RecordDetail {
  internal_record_id: string;
  additional_fields: Record<string, unknown>;
}

interface TabConfig {
  'tab-id': string;
  'tab-label': string;
  order: number;
}

interface TabsApiResponse {
  tabs: TabConfig[];
}

interface SectionsApiResponse {
  sections: UISchema['sections'];
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function RegisterDetailPage() {
  const routeParams = useParams<{ id: string; type: string }>();
  const { id: recordId, type: registerType } = routeParams;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const widgetStore = useMemo(() => createWidgetStore(), []);

  const { data: tabsData } = useFetch<TabsApiResponse>({
    url: `/api/register/${registerType}/tabs`,
  });

  const { data: registersData } = useFetch<Register[]>({
    url: '/api/register/all',
  });

  const currentRegister = useMemo(
    () => registersData?.find(
      (register) => register.register_mnemonic.toLowerCase() === registerType.toLowerCase()
    ),
    [registersData, registerType]
  );

  const { data: recordDetail } = useFetch<RecordDetail>({
    url: `/api/register/${registerType}/${recordId}`,
    enabled: !!currentRegister?.register_id,
    options: {
      method: 'POST',
      body: JSON.stringify({
        register_id: currentRegister?.register_id,
        internal_record_id: recordId,
      }),
    },
  });

  const activeTabId = useMemo(
    () => tabsData?.tabs?.[activeTabIndex]?.['tab-id'],
    [tabsData, activeTabIndex]
  );

  const { data: sectionsData } = useFetch<SectionsApiResponse>({
    url: `/api/register/${registerType}/tabs/${activeTabId}/sections`,
    enabled: !!activeTabId,
  });

  const recordFields = useMemo(
    () => recordDetail?.additional_fields,
    [recordDetail]
  );

  useEffect(() => {
    const totalTabs = tabsData?.tabs?.length || 0;
    if (totalTabs > 0 && activeTabIndex >= totalTabs) {
      setActiveTabIndex(0);
    }
  }, [tabsData, activeTabIndex]);

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (!currentRegister) return [];

    const activeTab = tabsData?.tabs?.[activeTabIndex];
    const items: BreadcrumbItem[] = [
      {
        label: currentRegister.register_subject,
        href: `/register/${registerType}`,
      },
      {
        label: `ID-${recordId}`,
        href: `/register/${registerType}/${recordId}`,
      },
    ];

    if (activeTab) {
      items.push({
        label: activeTab['tab-label'],
        href: `/register/${registerType}/${recordId}`,
      });
    }

    return items;
  }, [currentRegister, tabsData, activeTabIndex, registerType, recordId]);

  const { execute: submitChangeRequest } = useFetch();

  const handleSectionSave = useCallback(
    async (sectionChanges: SectionChanges) => {
      if (!currentRegister) return;

      const changeRequestPayload = {
        ...sectionChanges,
        register_id: currentRegister.register_id,
        internal_record_id: recordId,
      };

      await submitChangeRequest(
        `/api/register/${registerType}/${recordId}/change_request/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(changeRequestPayload),
        }
      );
    },
    [currentRegister, recordId, registerType, submitChangeRequest]
  );

  const handleTabSelect = useCallback((tabIndex: number) => {
    setActiveTabIndex(tabIndex);
  }, []);

  const canRenderContent = sectionsData && recordFields && currentRegister;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-10 py-4 bg-white border-b border-gray-300">
        <BreadcrumbBar breadcrumb={breadcrumbItems} />
      </div>

      <div className="px-10 py-6">
        <div className="flex gap-2 mb-6 border-b-4 border-gray-300">
          {tabsData?.tabs?.map((tab, tabIndex) => (
            <button
              key={tab['tab-id']}
              onClick={() => handleTabSelect(tabIndex)}
              className={`px-12 py-3 font-bold transition-all rounded-t-lg ${
                activeTabIndex === tabIndex
                  ? 'bg-black text-white'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {tab['tab-label']}
            </button>
          ))}
        </div>

        {canRenderContent && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              <WidgetProvider store={widgetStore} schemaData={recordFields}>
                <SectionsContainer
                  sections={sectionsData.sections}
                  onSectionSave={handleSectionSave}
                />
              </WidgetProvider>
            </div>

            <div className="col-span-3 flex flex-col gap-6">
              <ChangeRequestCard
                registerId={currentRegister.register_id}
                internalRecordId={recordId}
              />
              <VersionHistoryCard
                registerId={currentRegister.register_id}
                internalRecordId={recordId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
