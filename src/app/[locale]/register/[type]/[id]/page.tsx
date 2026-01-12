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
import { useBreadcrumb } from '@/shared/hooks';
import { UploadedDocument } from '@/shared/types';

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

    const breadcrumb = useBreadcrumb({
        type: registerType,
        recordId,
        includeActiveTab: true,
    });

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

    // need to transform data 
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

    const { execute: submitChangeRequest } = useFetch();
    const { execute: uploadDocumentRequest } = useFetch();

    const handleSectionSave = useCallback(
        async (sectionChanges: SectionChanges) => {
            console.log(sectionChanges, "section changes");

            if (!currentRegister) return;

            const newSectionValue = { ...(sectionChanges.new_section_value as Record<string, any>) };
            const filesToUpload: any[] = [];
            const fileLabels: string[] = [];

            Object.entries(newSectionValue).forEach(([key, value]) => {
                // Check for file object
                if (value && typeof value === 'object' && (value as any).__type === 'File') {
                    filesToUpload.push(value);
                    fileLabels.push(key);

                    // remove files form newValue
                    delete newSectionValue[key];
                }
            });

            // upload document then get document_lable_id and document_store_id
            const documentsResponse: UploadedDocument[] = [];
            if (filesToUpload.length > 0) {
                const documentsResponse = await uploadDocumentRequest(
                    `/api/change_request/upload_document`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            section_id: sectionChanges.section_id,
                            document_label_ids: fileLabels,
                            files: filesToUpload,
                        }),
                    }
                );
            }


            // creating change request
            await submitChangeRequest(
                `/api/change_request/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        register_id: currentRegister.register_id,
                        register_mnemonic: currentRegister.register_mnemonic,
                        internal_record_id: recordId,
                        section_register_id: null,
                        tab_id: activeTabId,
                        section_id: sectionChanges.section_id,
                        section_schema: sectionChanges.section_schema,
                        section_data: newSectionValue,
                        documents: documentsResponse,
                    }),
                }
            );
        },
        [currentRegister, recordId, registerType, submitChangeRequest, activeTabId, uploadDocumentRequest]
    );

    const canRenderContent =
        sectionsSchema &&
        sectionDataMap &&
        currentRegister &&
        sectionsConfig.length > 0;

    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumb}
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
