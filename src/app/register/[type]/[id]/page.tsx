'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  RegisterTabsLayout,
  VersionHistoryCard,
} from '@/components/shared';
import {
  WidgetProvider,
  UISchema,
  createWidgetStore,
  SectionChanges,
  SectionsContainer,
} from '@openg2p/registry-widgets';
import { useFetch } from '@/shared/hooks/useFetch';
import ChangeRequestCard from '@/features/change-request/components/ChangeRequestCard';
import { TabsResponse } from '@/shared/types';

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string | null;
}

interface RegisterFlattenedRecord {
  internal_record_id: string;
  [key: string]: unknown;
}

interface SectionsRecords {
  section_register_id: string;
  records: RegisterFlattenedRecord[];
}

interface SectionSchema {
  section_register_id: string;
  register_id: string;
  section_id: string;
  tab_id: string;
  section_mnemonic: string;
  section_description: string;
  documents_required: boolean;
  section_ui_schema: UISchema | null;
}

interface SectionsResponse {
  sections: SectionSchema[];
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function RegisterDetailPage() {
  const { id: recordId, type: registerType } =
    useParams<{ id: string; type: string }>();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const widgetStore = useMemo(() => createWidgetStore(), []);

  const { data: tabsSchema } = useFetch<TabsResponse>({
    url: `/api/register/${registerType}/tabs`,
  });

  const { data: registersData } = useFetch<Register[]>({
    url: '/api/register/all',
  });

  const currentRegister = useMemo(
    () =>
      registersData?.find(
        r => r.register_mnemonic.toLowerCase() === registerType.toLowerCase()
      ),
    [registersData, registerType]
  );

  const activeTabId = useMemo(
    () => tabsSchema?.tabs?.[activeTabIndex]?.tab_id,
    [tabsSchema, activeTabIndex]
  );

  const { data: sectionsSchema } = useFetch<SectionsResponse>({
    url: `/api/register/${registerType}/tabs/${activeTabId}/sections`,
    enabled: !!activeTabId,
  });

  const { data: sectionsRecords } = useFetch<SectionsRecords[]>({
    url: `/api/register/${registerType}/${recordId}/${activeTabId}`,
    enabled: !!currentRegister?.register_id && !!activeTabId,
    options: {
      method: 'POST',
      body: JSON.stringify({
        register_id: currentRegister?.register_id,
        internal_record_id: recordId,
      }),
    },
  });



  // need to transform data if section use 
  const sectionDataMap = useMemo(() => {
    if (!sectionsRecords) return null;

    const map: Record<
      string,
      RegisterFlattenedRecord | RegisterFlattenedRecord[]
    > = {};

    for (const section of sectionsRecords) {
      const { section_register_id, records } = section;

      if (!records || records.length === 0) continue;

      map[section_register_id] =
        records.length === 1 ? records[0] : records;
    }

    return map;
  }, [sectionsRecords]);


  const sectionsConfig = useMemo(() => {
    if (!sectionsSchema) return [];

    return sectionsSchema.sections
      .filter(section => section.section_ui_schema)
      .flatMap(section => section.section_ui_schema!.sections);
  }, [sectionsSchema]);

  useEffect(() => {
    const totalTabs = tabsSchema?.tabs?.length || 0;
    if (totalTabs > 0 && activeTabIndex >= totalTabs) {
      setActiveTabIndex(0);
    }
  }, [tabsSchema, activeTabIndex]);

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (!currentRegister) return [];

    const activeTab = tabsSchema?.tabs?.[activeTabIndex];

    return [
      {
        label: currentRegister.register_subject,
        href: `/register/${registerType}`,
      },
      {
        label: `ID-${recordId}`,
        href: `/register/${registerType}/${recordId}`,
      },
      ...(activeTab
        ? [{ label: activeTab.tab_label, href: '#' }]
        : []),
    ];
  }, [currentRegister, tabsSchema, activeTabIndex, registerType, recordId]);

  const { execute: submitChangeRequest } = useFetch();

  const handleSectionSave = useCallback(
    async (sectionChanges: SectionChanges) => {
      console.log(sectionChanges, "section changes");

      if (!currentRegister) return;
      await submitChangeRequest(
        `/api/register/${registerType}/${recordId}/change_request/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            register_id: currentRegister.register_id,
            section_register_id: null,// section_register_id and section_id will same.
            tab_id: activeTabId,
            change_payload: sectionChanges,
          }),
        }
      );
    },
    [currentRegister, recordId, registerType, submitChangeRequest]
  );

  const canRenderContent =
    tabsSchema &&
    sectionsSchema &&
    sectionDataMap &&
    currentRegister &&
    sectionsConfig.length > 0;

  if (!tabsSchema?.tabs?.length) return null;

  return (
    <RegisterTabsLayout
      breadcrumb={breadcrumbItems}
      tabs={tabsSchema}
      activeTab={activeTabIndex}
      onTabChange={setActiveTabIndex}
    >
      {canRenderContent && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <WidgetProvider store={widgetStore} schemaData={sectionDataMap}>
              <SectionsContainer
                sections={sectionsConfig}
                onSectionSave={handleSectionSave}
              />
            </WidgetProvider>
          </div>

          <div className="col-span-3 flex flex-col gap-6">
            <ChangeRequestCard
              type={registerType}
              registerId={currentRegister.register_id}
              internalRecordId={recordId}
              activeTabId={activeTabId}
            />
            <VersionHistoryCard
              type={registerType}
              registerId={currentRegister.register_id}
              internalRecordId={recordId}
            />
          </div>
        </div>
      )}
    </RegisterTabsLayout>
  );
}
