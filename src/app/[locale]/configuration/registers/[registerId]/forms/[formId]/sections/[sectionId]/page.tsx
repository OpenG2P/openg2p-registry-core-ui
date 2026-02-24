'use client';

import { useState } from 'react';
import { BreadcrumbBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import EditSectionModal from '@/features/configuration/components/EditSectionModal';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import { useConfigTabs } from '@/features/configuration/hooks/useConfigTabs';
import { useConfigSections } from '@/features/configuration/hooks/useConfigSections';
import SectionDetailsConfigView from '@/features/configuration/components/SectionDetailsConfigView';
import { getRegisterDetails, getTabDetails, getSectionDetails } from '@/features/configuration/utils/configUtils';


const PAFormSectionConfigurationPage = () => {
    const { registerId, formId, sectionId } = useParams<{
        registerId: string;
        formId: string;
        sectionId: string;
    }>();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { registers, loading: registersLoading } = useAllRegister(1, 100);
    // Forms share the tab data model; formId maps to tab_id in the backend
    const { tabs: forms, loading: formsLoading } = useConfigTabs(registerId, 1, 100);
    const { sections, loading: sectionsLoading, refresh } = useConfigSections(registerId, formId, 1, 100);

    const registerDetails = getRegisterDetails(registerId, registers);
    const formDetails = getTabDetails(formId, forms);
    const sectionDetails = getSectionDetails(sectionId, sections);

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            {
                label: registerDetails.register_mnemonic || '',
                href: `/configuration/registers/${registerId}`
            },
            {
                label: formDetails.tab_label || '',
                href: `/configuration/registers/${registerId}/forms/${formId}`
            },
            {
                label: sectionDetails.section_mnemonic || '',
                href: `/configuration/registers/${registerId}/forms/${formId}/sections/${sectionId}`
            }
        ]
    });

    const isLoading = registersLoading || formsLoading || sectionsLoading;

    if (isLoading) {
        return (
            <div className="min-h-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
            </div>
        );
    }

    return (
        <>
            <div className="pt-4 px-7.5 mb-2 shrink-0">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <ConfigDetailsSummary
                title={sectionDetails.section_mnemonic || 'None'}
                description={sectionDetails.section_description || 'None'}
                extraInfo1={String(sectionDetails.section_order || 0)}
                extraInfo2={formDetails.tab_label || 'None'}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <SectionDetailsConfigView
                sectionUISchema={sectionDetails?.section_ui_schema}
                registerId={sectionDetails?.section_register_id || ''}
                sectionId={sectionDetails?.section_id || ''}
            />

            <EditSectionModal
                isOpen={isEditModalOpen}
                initialData={sectionDetails as any}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refresh}
            />
        </>
    );
};

export default PAFormSectionConfigurationPage;