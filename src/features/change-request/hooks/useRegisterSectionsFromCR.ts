import { useMemo } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { TabSection } from "@/features/register/types";

interface Params {
  registerId?: string;
  tabId?: string;
  internalRecordId?: string;
}

export const useRegisterSectionsFromCR = ({
  registerId,
  tabId,
  internalRecordId,
}: Params) => {
  // Fetch tab sections (UI schema)

  const { data: tabSections, loading: loadingSchema } = useFetch<TabSection[]>({
    url: `/api/register/tab-sections`,
    enabled: !!registerId && !!tabId,
    options: {
      method: "POST",
      body: JSON.stringify({
        register_id: registerId,
        tab_id: tabId,
      }),
    },
  });

  // Ordered UI sections
  const orderedTabSections = useMemo(() => {
    if (!tabSections) return [];

    return [...tabSections]
      .sort(
        (a, b) => (a.section_order ?? 0) - (b.section_order ?? 0)
      )
      .flatMap(section => section.section_ui_schema?? []);
  }, [tabSections]);

  return {
    orderedTabSections,
    loadingSchema
  };
};
