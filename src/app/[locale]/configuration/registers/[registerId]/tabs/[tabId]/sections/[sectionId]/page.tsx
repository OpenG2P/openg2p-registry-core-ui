'use client';
import { useState } from 'react';

import { BreadcrumbBar } from '@/components/shared';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import { useParams } from 'next/navigation';
import { TAB_MOCK_DATA } from '@/features/configuration/components/RegisterTabConfigView';
import { SECTION_MOCK_DATA } from '@/features/configuration/components/RegisterSectionConfigView';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { REGISTER_MOCK_DATA } from '@/features/configuration/components/RegistersConfigView';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import EditSectionModal from '@/features/configuration/components/EditSectionModal';

const SectionConfigurationPage = () => {
    const { registerId, tabId, sectionId } = useParams<{
        registerId: string;
        tabId: string;
        sectionId: string;
    }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getRegisterDetails = (nameOrId: string) => {
        const registerData = REGISTER_MOCK_DATA.find(
            r => r.mnemonic.toLowerCase() === nameOrId.toLowerCase() || r.register_id === nameOrId
        );
        return registerData || { mnemonic: nameOrId };
    };

    const getTabDetails = (nameOrId: string) => {
        const tabData = TAB_MOCK_DATA.find(
            t => t.tab_name.toLowerCase() === nameOrId.toLowerCase() || t.tab_id === nameOrId
        );
        return { tab_name: tabData ? tabData.tab_name : nameOrId };
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
                    selectionOptions={TAB_MOCK_DATA.map(t => t.tab_name)}
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
