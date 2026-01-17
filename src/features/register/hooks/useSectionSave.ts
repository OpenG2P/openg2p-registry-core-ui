import { useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { UploadedDocument } from "@/shared/types";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import { SectionChanges } from "@openg2p/registry-widgets";
import { extractFilesFromSection } from "../utils";

import { TabSection } from "@/features/register/types";

export const useSectionSave = (tabSections: TabSection[] | null) => {
    const { internalRecordId } = useRegisterRecord();
    const { activeTabId } = useRegisterTabs();
    const { currentRegister } = useRegister();

    const { execute: submitChangeRequest } = useFetch();
    const { execute: uploadDocumentRequest } = useFetch();

    const handleSectionSave = useCallback(
        async (sectionChanges: SectionChanges) => {
            if (!currentRegister || !internalRecordId) {
                return;
            }

            const section = tabSections?.find(
                (section) => section.section_id === sectionChanges.section_id
            );

            if (!section) {
                console.error("Section not found in tabSections", sectionChanges.section_id);
                return;
            }

            const { normalizedData, filesToUpload, fileLabels } =
                extractFilesFromSection(
                    sectionChanges.new_section_value as Record<string, any>
                );

            let documentsResponse: UploadedDocument[] = [];

            if (filesToUpload.length > 0) {
                const formData = new FormData();
                formData.append("section_id", sectionChanges.section_id);

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

            await submitChangeRequest(`/api/change_request/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    register_id: currentRegister.register_id,
                    register_mnemonic: currentRegister.register_mnemonic,
                    internal_record_id: internalRecordId,
                    section_register_id: section.section_register_id,
                    tab_id: activeTabId,
                    section_id: sectionChanges.section_id,
                    section_schema: sectionChanges.section_schema,
                    section_data: normalizedData,
                    documents: documentsResponse,
                }),
            });
        },
        [
            currentRegister,
            internalRecordId,
            submitChangeRequest,
            activeTabId,
            uploadDocumentRequest,
            tabSections,
        ]
    );

    return { handleSectionSave };
};
