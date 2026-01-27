'use client';
import { useState } from 'react';

import { BreadcrumbBar } from '@/components/shared';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import { useParams } from 'next/navigation';
import EditSectionModal from '@/features/configuration/components/EditSectionModal';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import { useConfigTabs } from '@/features/configuration/hooks/useConfigTabs';
import { SECTION_MOCK_DATA } from '@/features/configuration/components/RegisterSectionConfigView';

const SectionConfigurationPage = () => {
    const { registerId, tabId, sectionId } = useParams<{
        registerId: string;
        tabId: string;
        sectionId: string;
    }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { registers } = useAllRegister();
    const { tabs } = useConfigTabs(registerId);

    const getRegisterDetails = (nameOrId: string) => {
        const registerData = registers.find(
            r => r.register_mnemonic.toLowerCase() === nameOrId.toLowerCase() || r.register_id === nameOrId
        );
        return registerData ? { mnemonic: registerData.register_mnemonic } : { mnemonic: nameOrId };
    };

    const getTabDetails = (nameOrId: string) => {
        const tabData = tabs.find(
            t => t.tab_id === nameOrId
        );
        return { tab_name: tabData ? tabData.tab_label : nameOrId };
    };

    const getSectionDetails = (nameOrId: string) => {
        const sectionData = SECTION_MOCK_DATA.find(
            s => s.section_name.toLowerCase() === nameOrId.toLowerCase() || s.section_id === nameOrId
        );
        return {
            section_name: sectionData ? sectionData.section_name : nameOrId,
            description: sectionData ? sectionData.description : "Description text..."
        };
    };

    const registerDetails = getRegisterDetails(registerId);
    const tabDetails = getTabDetails(tabId);
    const sectionDetails = getSectionDetails(sectionId);

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            { label: registerDetails.mnemonic, href: `/configuration/registers/${registerId}` },
            { label: tabDetails.tab_name, href: `/configuration/registers/${registerId}/tabs/${tabId}` },
            { label: sectionDetails.section_name, href: `/configuration/registers/${registerId}/tabs/${tabId}/sections/${sectionId}` }
        ]
    });


    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4] flex">
            <div className="mt-4">
                <ConfigSidebar activeOption={"registers"} />
            </div>

            <div className="flex-1">
                <div className="pt-10 px-7.5 mb-6">
                    <BreadcrumbBar breadcrumb={breadcrumb} />
                </div>

                <ConfigDetailsSummary
                    title={sectionDetails.section_name}
                    description={sectionDetails.description}
                    extraInfo={tabDetails.tab_name}
                    status={true}
                    selectionOptions={tabs.map(t => t.tab_label)}
                    onSave={(data) => console.log('Saved Section:', data)}
                    onEdit={() => setIsEditModalOpen(true)}
                />


                <div className="p-8">
                    <div className="bg-white rounded-[30px] p-8 min-h-100 flex items-center justify-center text-gray-400">
                        {`Widget Editor for ${sectionDetails.section_name} section`}
                    </div>
                </div>

                <EditSectionModal
                    isOpen={isEditModalOpen}
                    initialData={{
                        sectionName: sectionDetails.section_name,
                        description: sectionDetails.description
                    }}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default SectionConfigurationPage;
