import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBreadcrumb } from "@/shared/hooks";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import { createWidgetStore } from "@openg2p/registry-widgets";
import { useRegisterSections } from "./useRegisterSections";

export const useRegisterDetail = () => {
  const t = useTranslations();
  const { type: registerType } = useParams<{ type: string }>();
  const {
    internalRecordId,
    functionalRecordId,
    loading: resolvingId,
  } = useRegisterRecord();

  const widgetStore = useMemo(() => createWidgetStore(), []);

  const { tabs, activeTabIndex, activeTabId, setActiveTabByIndex } =
    useRegisterTabs();

  const { currentRegister } = useRegister();

  const breadcrumb = useBreadcrumb({
    type: registerType,
    recordId: functionalRecordId,
    includeActiveTab: true,
  });

  const {
    tabSections,
    sectionSchemaDataMap,
    handleSectionSave,
    canRenderContent,
  } = useRegisterSections();

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
    tabSections,
    sectionSchemaDataMap,
    handleSectionSave,
    canRenderContent,
    currentRegister,
  };
};
