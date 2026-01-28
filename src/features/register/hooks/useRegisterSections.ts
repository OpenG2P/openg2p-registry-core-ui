import { useMemo } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import {
  TabSection,
  RegisterFlattenedRecord,
  TabSectionData,
} from "@/features/register/types";
import { useSectionSave } from "./useSectionSave";

export const useRegisterSections = (onChangeRequestCreated: () => void) => {
  const { internalRecordId } = useRegisterRecord();
  const { activeTabId } = useRegisterTabs();
  const { currentRegister } = useRegister();

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

  const { data: tabSectionsData } = useFetch<TabSectionData[]>({
    url: `/api/register/tab-sections-data`,
    enabled:
      !!currentRegister?.register_id && !!activeTabId && !!internalRecordId,
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
      RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
    > = {};

    for (const section of tabSectionsData) {
      if (!section.records?.length) continue;

      if (section.is_list === true) {
        map[section.section_register_id] = { records: section.records, };
      } else {
        map[section.section_register_id] = section.records[0];
      }
    }

    return map;
  }, [tabSectionsData]);


  const orderedTabSections = useMemo(() => {
    if (!tabSections) return [];

    return [...tabSections]
      .sort(
        (sectionA, sectionB) =>
          (sectionA.section_order ?? 0) - (sectionB.section_order ?? 0),
      )
      .flatMap((section) => section.section_ui_schema?? []);
  }, [tabSections]);

  const { handleSectionSave } = useSectionSave(tabSections, onChangeRequestCreated);

  const canRenderContent = !!(
    tabSections &&
    currentRegister &&
    internalRecordId
  );
  return {
    tabSections,
    orderedTabSections,
    sectionDataMap,
    handleSectionSave,
    canRenderContent,
  };
};
