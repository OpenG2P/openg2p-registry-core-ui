import { useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { UploadedDocument } from "@/shared/types";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import { SectionChanges } from "@openg2p/registry-widgets";
import { extractFilesFromSection, normalizeEditActions } from "../utils";
// import { showToast } from "nextjs-toast-notify";

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
            const { filesToUpload, fileLabels } = extractFilesFromSection(sectionChanges);

            let documentsResponse: UploadedDocument[] = [];
            if (filesToUpload.length > 0) {
                const formData = new FormData();
                // formData.append("section_id", sectionChanges.section_id);

                fileLabels.forEach((label) => {
                    formData.append("document_label", label);
                });

                filesToUpload.forEach((file) => {
                    formData.append("documents", file);
                });
                documentsResponse = await uploadDocumentRequest(
                    "/api/change_request/upload_document",
                    {
                        method: "POST",
                        body: formData,
                    }
                );
            }

            const records = normalizeEditActions(
                sectionChanges.records,
                internalRecordId
            )
            const change_request_response = await submitChangeRequest(`/api/change_request/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    register_id: currentRegister.register_id,
                    register_mnemonic: currentRegister.register_mnemonic,
                    internal_record_id: internalRecordId,
                    section_register_id: section.section_register_id,
                    tab_id: activeTabId,
                    section_id: sectionChanges.section_id,
                    section_records: records,
                    documents: documentsResponse,
                }),
            });

            // if (change_request_response?.change_request_id) {
            //     showToast.success(`Change request created successfully!`, {
            //         position: "top-right",
            //         duration: 6000,
            //         sound:true
            //     });
            // }else{
            //     showToast.error(`Failed to create change request!`, {
            //         position: "top-right",
            //         duration: 6000,
            //         sound:true
            //     });
            // }
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
