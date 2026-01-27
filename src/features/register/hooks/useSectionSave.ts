import { useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { UploadedDocument } from "@/shared/types";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterTabs } from "@/context/RegisterTabsContext";
import { useRegisterRecord } from "@/context/RegisterRecordContext";
import { SectionChanges } from "@openg2p/registry-widgets";
import { extractFilesFromSection, normalizeEditActions } from "../utils";
import { TabSection } from "@/features/register/types";
import { toast } from "react-toastify";


export const useSectionSave = (
    tabSections: TabSection[] | null,
    onChangeRequestCreated: () => void
) => {
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
                try {
                    // Upload files one by one with their corresponding labels
                    for (let i = 0; i < filesToUpload.length; i++) {
                        const formData = new FormData();
                        formData.append("document_label", fileLabels[i]);
                        formData.append("documents", filesToUpload[i]);

                        const uploadResult = await uploadDocumentRequest(
                            "/api/change_request/upload_document",
                            {
                                method: "POST",
                                body: formData,
                            }
                        );

                        if (Array.isArray(uploadResult)) {
                            documentsResponse.push(...uploadResult);
                        } else if (uploadResult) {
                            documentsResponse.push(uploadResult);
                        }
                    }

                    // Show success toast after all files are uploaded
                    toast.success(`${filesToUpload.length} file(s) uploaded successfully!`, {
                        position: "top-right",
                        autoClose: 4000,
                    });
                } catch (error) {
                    toast.error(`Failed to upload files. Please try again.`, {
                        position: "top-right",
                        autoClose: 6000,
                    });
                    console.error("File upload error:", error);
                    return;
                }
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

            if (change_request_response?.change_request_id) {
                toast.success(`Change request created successfully!`, {
                    position: "top-right",
                    autoClose: 6000,
                });
                // Update the Pending change request count
                onChangeRequestCreated();
            } else {
                toast.error(`Failed to create change request!`, {
                    position: "top-right",
                    autoClose: 6000,
                });
            }
        },
        [
            currentRegister,
            internalRecordId,
            submitChangeRequest,
            activeTabId,
            uploadDocumentRequest,
            tabSections,
            onChangeRequestCreated,
        ]
    );

    return { handleSectionSave };
};
