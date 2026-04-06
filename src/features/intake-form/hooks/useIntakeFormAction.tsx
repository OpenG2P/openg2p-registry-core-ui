import { useRouter } from 'next/navigation';
import { useFetch } from '@/shared/hooks/useFetch';
import { toast } from 'react-toastify';
import { IntakeFormSection } from '../types/intake-form';
import { useState } from 'react';
import ActionModal from '@/components/shared/ActionModal';
import type { SectionChanges } from '@openg2p/registry-widgets';
import { extractFilesFromSection, intakeNormalisedRecords } from '@/features/register/utils';
import { UploadedDocument } from '@/shared/types';
import { useTranslations } from 'next-intl';

interface UseIntakeFormActionProps {
    registerId?: string;
    tabId: string;
    registerType: string;
    sections?: IntakeFormSection[] | null;
    submissionId?: string | null;
    onSuccess?: () => void;
}

export const useIntakeFormAction = ({
    registerId,
    tabId,
    registerType,
    sections,
    submissionId = null,
    onSuccess
}: UseIntakeFormActionProps) => {
    const t = useTranslations();
    const router = useRouter();
    const { execute: executeSave } = useFetch();
    const { execute: uploadDocumentRequest } = useFetch();

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'warning' | 'success';
        title: string;
        subtitle: string;
        onConfirm?: () => void;
        onClose: () => void;
        confirmText?: string;
        cancelText?: string;
        hideCancel?: boolean;
    } | null>(null);

    const closeModal = () => {
        setModalConfig(null);
    };

    const performSave = async (sectionChanges: SectionChanges[], action: 'submit' | 'draft') => {
        if (!sections || !registerId) return;


        const sectionPayloads = [];

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const change = sectionChanges[i];
            const files = change?.files ?? [];
            const { filesToUpload = [], fileLabels = [] } =
                extractFilesFromSection(files) || {};

            let documentsResponse: UploadedDocument[] = [];

            if (filesToUpload.length > 0) {
                try {
                    for (let j = 0; j < filesToUpload.length; j++) {
                        const formData = new FormData();
                        formData.append("document_label", fileLabels[j]);
                        formData.append("documents", filesToUpload[j]);

                        const uploadResult = await uploadDocumentRequest(
                            "/api/change-request/upload-document",
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
                } catch (error) {
                    toast.error(t('toast_upload_failed'), {
                        position: "top-right",
                        autoClose: 6000,
                    });
                    console.error("File upload error:", error);
                    return;
                }
            }

            // Keep existing documents that are already uploaded
            const existingDocuments = (change?.files || []).filter(file => file && typeof file === 'object' && ('document_store_id' in file));
            documentsResponse = [...existingDocuments as UploadedDocument[], ...documentsResponse];

            sectionPayloads.push({
                section_id: section.section_id,
                intake_form_section_payload: intakeNormalisedRecords(change?.records || []),
                documents: documentsResponse
            });


        }

        const draftPayload = {
            submission_id: submissionId,
            register_id: registerId,
            tab_id: tabId,
            foundational_id: null,
            link_foundational_id: null,
            no_of_verifications_required: 0,
            // Currently all request through application submission 
            // treated as add action to the register
            edit_action: "ADD",
            section_payloads: sectionPayloads,
        };

        try {
            const draftResult = await executeSave('/api/intake-form/submission/save-draft', {
                method: 'POST',
                body: JSON.stringify(draftPayload)
            });

            if (!draftResult) {
                toast.error(t('toast_operation_failed'));
                return;
            }

            const handleSuccessClose = (isDraft: boolean) => {
                closeModal();
                if (!submissionId) {
                    if (isDraft && draftResult?.submission_id) {
                        router.push(`/intake-form/${registerType}/submission/${draftResult.submission_id}`);
                    } else {
                        router.push(`/intake-form/${registerType}`);
                    }
                } else {
                    if (onSuccess) onSuccess();
                }
            };

            if (action === 'submit') {
                const finalSubmissionId = draftResult?.submission_id

                if (!finalSubmissionId) {
                    toast.error(t('toast_draft_saved_warning'));
                    return;
                }

                const submitResult = await executeSave('/api/intake-form/submission/finalize', {
                    method: 'POST',
                    body: JSON.stringify({
                        submission_id: finalSubmissionId,
                    })
                });

                if (submitResult) {
                    setModalConfig({
                        isOpen: true,
                        type: 'success',
                        title: t('submitted_successfully'),
                        subtitle: t('submitted_successfully_subtitle'),
                        confirmText: t('close'),
                        hideCancel: true,
                        onClose: () => handleSuccessClose(false),
                        onConfirm: () => handleSuccessClose(false)
                    });
                } else {
                    toast.error(t('toast_submission_failed'));
                }
            } else if (draftResult?.submission_id) {
                setModalConfig({
                    isOpen: true,
                    type: 'success',
                    title: t('draft_saved_successfully'),
                    subtitle: t('draft_saved_successfully_subtitle'),
                    confirmText: t('close'),
                    hideCancel: true,
                    onClose: () => handleSuccessClose(true),
                    onConfirm: () => handleSuccessClose(true)
                });
            }
        } catch (error) {
            toast.error(t('toast_form_save_error'));
        }
    };

    const handleAction = async (sectionChanges: SectionChanges[], action: 'submit' | 'draft') => {
        if (!sections || !registerId) return;

        if (action === 'submit') {
            setModalConfig({
                isOpen: true,
                type: 'warning',
                title: t('are_you_sure'),
                subtitle: t('submit_confirmation_subtitle'),
                confirmText: t('submit'),
                cancelText: t('cancel'),
                onClose: closeModal,
                onConfirm: () => {
                    closeModal();
                    performSave(sectionChanges, 'submit');
                }
            });
        } else {
            await performSave(sectionChanges, 'draft');
        }
    };

    const FormActionModals = () => {
        if (!modalConfig) return null;
        return <ActionModal {...modalConfig} />;
    };

    return { handleAction, FormActionModals };
};
