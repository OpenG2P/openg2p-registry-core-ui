'use client';
import { useState } from 'react';

import { BreadcrumbBar } from '@/components/shared';
import ConfigLayout from '@/features/configuration/components/ConfigLayout';
import { useParams } from 'next/navigation';
import EditSectionModal from '@/features/configuration/components/EditSectionModal';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import { useConfigTabs } from '@/features/configuration/hooks/useConfigTabs';
import { useConfigSections } from '@/features/configuration/hooks/useConfigSections';
import SectionDetailsConfigView from '@/features/configuration/components/SectionDetailsConfigView';
import { getRegisterDetails, getTabDetails, getSectionDetails } from '@/features/configuration/utils/configUtils';

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
            { label: registerDetails.register_mnemonic, href: `/configuration/registers/${registerId}` },
            { label: tabDetails.tab_label, href: `/configuration/registers/${registerId}/tabs/${tabId}` },
            { label: sectionDetails.section_name, href: `/configuration/registers/${registerId}/tabs/${tabId}/sections/${sectionId}` }
        ]
    });

    const isLoading = registersLoading || tabsLoading || sectionsLoading;

    if (isLoading) {
        return (
            <ConfigLayout activeOption="registers">
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
                </div>
            </ConfigLayout>
        );
    }



    return (
        <ConfigLayout activeOption="registers">
            <div className="pt-10 px-7.5 mb-6">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <ConfigDetailsSummary
                title={sectionDetails.section_name}
                description={sectionDetails.description}
                extraInfo={tabDetails.tab_label}
                status={true}
                selectionOptions={tabs.map(t => t.tab_label)}
                onSave={(data) => console.log('Saved Section:', data)}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <SectionDetailsConfigView
                sectionUISchema={sectionDetails?.section_ui_schema}
            />
            <EditSectionModal
                isOpen={isEditModalOpen}
                initialData={sectionDetails}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refresh}
            />
        </ConfigLayout>
    );
};

export default SectionConfigurationPage;
