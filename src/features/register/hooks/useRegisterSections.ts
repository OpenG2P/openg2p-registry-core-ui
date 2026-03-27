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
import { useRbac } from "@/context/RbacContext";
import { CHANGE_REQUEST_ACTIONS } from "@/features/change-request/utils/changeRequest.actions";

export const useRegisterSections = (onChangeRequestCreated: () => void) => {
    const { internalRecordId } = useRegisterRecord();
    const { activeTabId } = useRegisterTabs();
    const { currentRegister } = useRegister();
    const { can } = useRbac();

    // list of tab sections
    const { data: tabSections, loading: loadingSections } = useFetch<TabSection[]>({
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

    const { data: tabSectionsData, loading: loadingData } = useFetch<TabSectionData[]>({
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
                map[section.section_register_id] = { records: section.records };
            } else {
                map[section.section_register_id] = section.records[0];
            }
        }

        return map;
    }, [tabSectionsData]);

    const orderedTabSections = useMemo(() => {
        if (!tabSections) return [];

        return [...tabSections]
            .sort((a, b) => (b.section_order ?? 0) - (a.section_order ?? 0))
            .map((section) => {
                const {
                    section_id,
                    register_purpose,
                    register_relation,
                    section_ui_schema,
                    section_register_id,
                } = section;

                // evalute change request creation allowed or not
                let hideEditButton = false;
                if (
                    (register_purpose === "REGISTER" ||
                        register_purpose === "PROGRAM_APPLICATION") &&
                    register_relation !== "SELF"
                ) {
                    hideEditButton = true;
                } else if (
                    register_purpose === "TABLE" &&
                    register_relation !== "DESCENDANT"
                ) {
                    hideEditButton = true;
                }

                if(!can(CHANGE_REQUEST_ACTIONS.create))
                {
                    hideEditButton = true
                }

                return {
                    section_id,
                    section_register_id,
                    section_ui_schema,
                    hideEditButton,
                };
            });
    }, [tabSections]);

    const { handleSectionSave } = useSectionSave(
        onChangeRequestCreated,
    );

    const isSchemaStale =
        tabSections &&
        tabSections.length > 0 &&
        tabSections[0].tab_id !== activeTabId;

    const isFetching = loadingSections || loadingData;

    const canRenderContent = !!(
        tabSections &&
        currentRegister &&
        internalRecordId &&
        !isSchemaStale &&
        !isFetching
    );
    return {
        tabSections,
        orderedTabSections,
        sectionDataMap,
        handleSectionSave,
        canRenderContent,
    };
};
