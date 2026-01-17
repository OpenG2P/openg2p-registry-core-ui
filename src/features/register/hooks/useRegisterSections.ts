import { useState, useEffect } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import { TabSection, SectionSchemaData } from "@/features/register/types";
import { useSectionSave } from "./useSectionSave";

export const useRegisterSections = () => {
  const { internalRecordId } = useRegisterRecord();
  const { activeTabId } = useRegisterTabs();
  const { currentRegister } = useRegister();

  const [sectionSchemaDataMap, setSectionSchemaDataMap] = useState<
    Record<string, SectionSchemaData>
  >({});

  // list of tab sections
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

  const { handleSectionSave } = useSectionSave(tabSections);

  const { execute: fetchSectionData } = useFetch<any>();

  useEffect(() => {
    if (
      !tabSections?.length ||
      !currentRegister?.register_id ||
      !internalRecordId
    ) {
      return;
    }

    const loadAllSections = async () => {
      try {
        const entries: [string, SectionSchemaData][] = [];

        for (const section of tabSections) {
          try {
            const response = await fetchSectionData("/api/register/section-data", {
              method: "POST",
              body: JSON.stringify({
                register_id: currentRegister.register_id,
                internal_record_id: internalRecordId,
                section_register_id: section.section_register_id,
              }),
            });

            if (!response || (Array.isArray(response) && response.length === 0)) {
              continue;
            }

            const normalizedData =
              Array.isArray(response) && response.length === 1 ? response[0] : response;

            entries.push([
              section.section_id,
              {
                sectionSchema: section.section_ui_schema,
                sectionData: {
                  [section.section_register_id]: {
                    ...(!Array.isArray(normalizedData) ? normalizedData : {}),
                    ...(Array.isArray(normalizedData)
                      ? { records: normalizedData }
                      : {}),
                  },
                },
              },
            ]);
          } catch (error) {
            console.error(`Failed loading section ${section.section_id}:`, error);
          }
        }

        setSectionSchemaDataMap(Object.fromEntries(entries));
      } catch (error) {
        console.error("Critical error loading section data", error);
      }
    };

    loadAllSections();
  }, [tabSections, currentRegister?.register_id, internalRecordId, fetchSectionData]);

  const canRenderContent = !!(
    tabSections &&
    currentRegister &&
    internalRecordId
  );
  return {
    tabSections,
    sectionSchemaDataMap,
    handleSectionSave,
    canRenderContent,
  };
};
