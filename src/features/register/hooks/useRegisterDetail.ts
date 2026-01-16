import { useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBreadcrumb } from "@/shared/hooks";
import { useFetch } from "@/shared/hooks/useFetch";
import { UploadedDocument,deserializeFile } from "@/shared/types";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import { createWidgetStore, SectionChanges } from "@openg2p/registry-widgets";
import {
  RegisterFlattenedRecord,
  TabSection,
  TabSectionData,
} from "@/features/register/types";

export const useRegisterDetail = () => {
  const t = useTranslations();
  const { type: registerType } = useParams<{ type: string }>();
  const { internalRecordId, functionalRecordId, loading: resolvingId } =
    useRegisterRecord();

  const widgetStore = useMemo(() => createWidgetStore(), []);

  const {
    tabs,
    activeTabIndex,
    activeTabId,
    setActiveTabByIndex,
  } = useRegisterTabs();

  const { currentRegister } = useRegister();

  const breadcrumb = useBreadcrumb({
    type: registerType,
    recordId: functionalRecordId,
    includeActiveTab: true,
  });

  const { data: tabSections } = useFetch<TabSection[]>({
    url: `/api/register/tab-sections`,
    enabled: !!activeTabId,
    options: {
      method: "POST",
      body: JSON.stringify({
        register_id: currentRegister?.register_id,
        tab_id: activeTabId,
      }),
    },
  });

  const { data: tabSectionsData } = useFetch<TabSectionData[]>({
    url: `/api/register/tab-sections-data`,
    enabled: !!currentRegister?.register_id && !!activeTabId && !!internalRecordId,
    options: {
      method: "POST",
      body: JSON.stringify({
        register_id: currentRegister?.register_id,
        internal_record_id: internalRecordId,
        tab_id: activeTabId,
      }),
    },
  });

  const sectionDataMap = useMemo(() => {
    if (!tabSectionsData) return undefined;

    const map: Record<
      string,
      RegisterFlattenedRecord | RegisterFlattenedRecord[]
    > = {};

    for (const section of tabSectionsData) {
      if (!section.records?.length) continue;
      map[section.section_register_id] =
        section.records.length === 1
          ? section.records[0]
          : section.records;
    }

    return map;
  }, [tabSectionsData]);

  const sectionsConfig = useMemo(() => {
    if (!tabSections) return [];
    return tabSections.flatMap(
      (section) => section.section_ui_schema?.sections ?? []
    );
  }, [tabSections]);

  const { execute: submitChangeRequest } = useFetch();
  const { execute: uploadDocumentRequest } = useFetch();

  const handleSectionSave = useCallback(
    async (sectionChanges: SectionChanges) => {
      
      if (!currentRegister || !internalRecordId) {
        return;
      }

      const newSectionValue = {
        ...(sectionChanges.new_section_value as Record<string, any>),
      };

      const filesToUpload: File[] = [];
      const fileLabels: string[] = [];

      Object.entries(newSectionValue).forEach(([key, value]) => {
        if (value && typeof value === "object" && value.__type === "File") {
          try {
            const realFile = deserializeFile(value);
            filesToUpload.push(realFile);
            fileLabels.push(key);
            delete newSectionValue[key];
          } catch (error) {
            console.error("Failed to deserialize file:", error);
          }
        }
      });

            let documentsResponse: UploadedDocument[] = [];
            console.log(filesToUpload,"filesToUpload")

            if (filesToUpload.length > 0) {
                const formData = new FormData();
                // TODO: Section id hardcoded need to remove
                formData.append(
                "section_id",
                "20a9362c-92d2-4c2c-b373-f09cfb3ded7b"
                );

                fileLabels.forEach((label) => {
                formData.append("document_label_ids", label);
                });

                filesToUpload.forEach((file) => {
                formData.append("files", file);
                });
                documentsResponse = await uploadDocumentRequest(
                "/api/change_request/upload_document",
                {
                    method: "POST",
                    body: formData,
                }
                );
            }
            console.log(documentsResponse);
            
            // TODO SectionId and Section_register_id hard coded need to remove 
            await submitChangeRequest(
                `/api/change_request/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        register_id: currentRegister.register_id,
                        register_mnemonic: currentRegister.register_mnemonic,
                        internal_record_id: internalRecordId,
                        section_register_id: "20a9362c-92d2-4c2c-b373-f09cfb3ded7b",
                        tab_id: activeTabId,
                        section_id: "20a9362c-92d2-4c2c-b373-f09cfb3ded7b",
                        section_schema: sectionChanges.section_schema,
                        section_data: newSectionValue,
                        documents: documentsResponse,
                    }),
                }
            );
        },
        [currentRegister, internalRecordId, registerType, submitChangeRequest, activeTabId, uploadDocumentRequest]
    );

  const canRenderContent =
    tabSections && sectionDataMap && currentRegister && internalRecordId;

  return {
    registerType,
    t,
    internalRecordId,
    resolvingId,
    widgetStore,
    tabs,
    activeTabIndex,
    setActiveTabByIndex,
    activeTabId,
    breadcrumb,
    sectionsConfig,
    sectionDataMap,
    handleSectionSave,
    canRenderContent,
    currentRegister,
  };
};
