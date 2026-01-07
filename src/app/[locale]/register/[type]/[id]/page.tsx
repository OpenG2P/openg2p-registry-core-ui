'use client';

import { useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import { useRegister } from '@/context/RegisterContext';
import { useRegisterTabs } from '@/context/RegisterTabsContext';

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

    const t = useTranslations();

    const { id: recordId, type: registerType } =
        useParams<{ id: string; type: string }>();

    const widgetStore = useMemo(() => createWidgetStore(), []);

    const {
        tabs,
        activeTab,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const { currentRegister } = useRegister();

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

    const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
        if (!currentRegister) return [];

        return [
            {
                label: t(currentRegister.register_subject) || currentRegister.register_subject,
                href: `/register/${registerType}`,
            },
            {
                label: `ID-${recordId}`,
                href: `/register/${registerType}/${recordId}`,
            },
            ...(activeTab
                ? [{ label: t(activeTab.tab_label) || activeTab.tab_label, href: '#' }]
                : []),
        ];
    }, [currentRegister, activeTabIndex, registerType, recordId, t]);

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
        sectionsSchema &&
        sectionDataMap &&
        currentRegister &&
        sectionsConfig.length > 0;

    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumbItems}
            tabs={{ tabs }}
            activeTab={activeTabIndex}
            onTabChange={setActiveTabByIndex}
        >
            {canRenderContent && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-9">
                        <WidgetProvider
                            store={widgetStore}
                            schemaData={sectionDataMap}
                            translate={t}
                        >
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
