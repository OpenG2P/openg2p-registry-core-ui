import { useRouter } from 'next/navigation';
import { useFetch } from '@/shared/hooks/useFetch';
import { toast } from 'react-toastify';
import { IntakeFormSection } from '../types/intake-form';
import { useState } from 'react';
import ActionModal from '@/components/shared/ActionModal';

interface UseIntakeFormActionProps {
    registerId?: string;
    tabId: string;
    registerType: string;
    sections?: IntakeFormSection[] | null;
    submissionId?: string | null;
}

export const useIntakeFormAction = ({
    registerId,
    tabId,
    registerType,
    sections,
    submissionId = null
}: UseIntakeFormActionProps) => {
    const router = useRouter();
    const { execute: executeSave } = useFetch({ enabled: false });

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

    const performSave = async (values: any, action: 'submit' | 'draft') => {
        if (!sections || !registerId) return;

        const sectionPayloads = sections.map(section => ({
            section_id: section.section_id,
            intake_form_section_payload: values[section.section_register_id] || {}
        }));

        console.log(sectionPayloads,"sectionPayloads")

        const draftPayload = {
            submission_id: submissionId,
            register_id: registerId,
            tab_id: tabId,
            foundational_id: null,
            link_foundational_id: null,
            no_of_verifications_required: 0,
            section_payloads: sectionPayloads
        };

        try {
            const draftResult = await executeSave('/api/intake-form/submission/save-draft', {
                method: 'POST',
                body: JSON.stringify(draftPayload)
            });

            console.log(draftResult,"*************draftresult")

            if (!draftResult) {
                toast.error('Operation failed');
                return;
            }

            if (action === 'submit') {
                const finalSubmissionId = draftResult?.response?.response_payload?.submission_id ||
                    draftResult?.response_payload?.submission_id ||
                    draftResult?.submission_id;

                if (!finalSubmissionId) {
                    toast.error('Draft saved, but could not finalize without submission ID');
                    return;
                }

                const submitResult = await executeSave('/api/intake-form/submission/finalize', {
                    method: 'POST',
                    body: JSON.stringify({
                        submission_id: finalSubmissionId,
                        current_page: 0,
                        page_size: 10,
                        sort_by: "",
                        filter_by: "",
                        search_text: ""
                    })
                });

                if (submitResult) {
                    setModalConfig({
                        isOpen: true,
                        type: 'success',
                        title: 'Submitted successfully',
                        subtitle: 'Your form submitted successfully, Thank you.',
                        confirmText: 'Close',
                        hideCancel: true,
                        onClose: () => {
                            closeModal();
                            router.push(`/intake-form/${registerType}`);
                        },
                        onConfirm: () => {
                            closeModal();
                            router.push(`/intake-form/${registerType}`);
                        }
                    });
                } else {
                    toast.error('Submission failed');
                }
            } else {
                setModalConfig({
                    isOpen: true,
                    type: 'success',
                    title: 'Draft Saved',
                    subtitle: 'Your info saved as draft you can restart your application again',
                    confirmText: 'Close',
                    hideCancel: true,
                    onClose: () => {
                        closeModal();
                        router.push(`/intake-form/${registerType}`);
                    },
                    onConfirm: () => {
                        closeModal();
                        router.push(`/intake-form/${registerType}`);
                    }
                });
            }
        } catch (error) {
            toast.error('Error occured while saving form');
        }
    };

    const handleAction = async (values: any, action: 'submit' | 'draft') => {
        if (!sections || !registerId) return;

        if (action === 'submit') {
            setModalConfig({
                isOpen: true,
                type: 'warning',
                title: 'Are you sure ?',
                subtitle: 'If you submit your application you cannot modified further.',
                confirmText: 'Submit',
                cancelText: 'Cancel',
                onClose: closeModal,
                onConfirm: () => {
                    closeModal();
                    performSave(values, 'submit');
                }
            });
        } else {
            await performSave(values, 'draft');
        }
    };

    const FormActionModals = () => {
        if (!modalConfig) return null;
        return <ActionModal {...modalConfig} />;
    };

    return { handleAction, FormActionModals };
};
