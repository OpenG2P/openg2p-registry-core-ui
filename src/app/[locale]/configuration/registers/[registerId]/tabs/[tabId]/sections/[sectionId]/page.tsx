'use client';
import { useState } from 'react';

import { BreadcrumbBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import {
    EditSectionModal,
    SectionDetailsConfigView
} from '@/features/configuration/registers';
import {
    ConfigDetailsSummary,
    useAllRegister,
    useConfigTabs,
    useConfigSections,
    getRegisterDetails,
    getTabDetails,
    getSectionDetails
} from '@/features/configuration/shared';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';

const SectionConfigurationPage = () => {
    const { registerId, tabId, sectionId } = useParams<{
        registerId: string;
        tabId: string;
        sectionId: string;
    }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { registers, loading: registersLoading } = useAllRegister(1, 100);
    const { tabs, loading: tabsLoading } = useConfigTabs(registerId, 1, 100);
    const { sections, loading: sectionsLoading, refresh } = useConfigSections(registerId, tabId, 1, 100);

    const registerDetails = getRegisterDetails(registerId, registers);
    const tabDetails = getTabDetails(tabId, tabs);
    const sectionDetails = getSectionDetails(sectionId, sections);

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            { label: registerDetails.register_mnemonic || '', href: `/configuration/registers/${registerId}` },
            { label: tabDetails.tab_label || '', href: `/configuration/registers/${registerId}/tabs/${tabId}` },
            { label: sectionDetails.section_mnemonic || '', href: `/configuration/registers/${registerId}/tabs/${tabId}/sections/${sectionId}` }
        ]
    });

    const isLoading = registersLoading || tabsLoading || sectionsLoading;

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
                extraInfo2={String(tabDetails.tab_label || 'None')}
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

export default SectionConfigurationPage;
