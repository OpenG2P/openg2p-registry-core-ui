'use client';

import { useState } from 'react';
import { TopBar, BreadcrumbBar } from '@/components/shared';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import { useParams } from 'next/navigation';
import RegisterSectionConfigView from '@/features/configuration/components/RegisterSectionConfigView';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import EditTabModal from '@/features/configuration/components/EditTabModal';

import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import { useConfigTabs } from '@/features/configuration/hooks/useConfigTabs';

const TabConfigurationPage = () => {
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        pageStart: 1,
        pageEnd: 12,
        total: 250_000_000,
    });

    const { registers } = useAllRegister();
    const { tabs } = useConfigTabs(registerId);

    const getRegisterDetails = (nameOrId: string) => {
        const registerData = registers.find(
            r => r.register_mnemonic.toLowerCase() === nameOrId.toLowerCase() || r.register_id === nameOrId
        );
        if (registerData) return {
            mnemonic: registerData.register_mnemonic,
            description: registerData.register_description,
            parentRegister: registerData.master_register_id
        };

        return {
            mnemonic: nameOrId,
            description: `Register configuration for: ${nameOrId}`,
            parentRegister: 'Parent Registry'
        };
    };

    const getTabDetails = (nameOrId: string) => {
        const tabData = tabs.find(
            t => t.tab_id === nameOrId // Assuming tab_id is the identifier
        );
        return {
            tab_name: tabData ? tabData.tab_label : nameOrId,
            description: "Description text..." // Description not available in Tab type
        };
    };

    const registerDetails = getRegisterDetails(registerId);
    const tabDetails = getTabDetails(tabId);

    const breadcrumb = useBreadcrumb({
        rootItem: { label: 'Registers', href: '/configuration/registers' },
        customItems: [
            { label: registerDetails.mnemonic, href: `/configuration/registers/${registerId}` },
            { label: tabDetails.tab_name, href: `/configuration/registers/${registerId}/tabs/${tabId}` }
        ]
    });


    const handlePrev = () => {
        setPagination((prev) => ({
            ...prev,
            pageStart: Math.max(1, prev.pageStart - 10),
            pageEnd: Math.max(10, prev.pageEnd - 10),
        }));
    };

    const handleNext = () => {
        setPagination((prev) => ({
            ...prev,
            pageStart: prev.pageStart + 10,
            pageEnd: prev.pageEnd + 10,
        }));
    };

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
                    title={tabDetails.tab_name}
                    description={tabDetails.description}
                    extraInfo={registerDetails.mnemonic}
                    status={true}
                    selectionOptions={registers.map(r => r.register_mnemonic)}
                    onSave={(data) => console.log('Saved Tab:', data)}
                    onEdit={() => setIsEditModalOpen(true)}
                />

                <TopBar
                    breadcrumb={[]}
                    showFilters={false}
                    showPagination={true}
                    showAddNewButton={true}
                    addNewButtonText={"Add New Section"}
                    onAddNewButton={() => setIsModalOpen(true)}
                    pageStart={pagination.pageStart}
                    pageEnd={pagination.pageEnd}
                    total={pagination.total}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />

                <RegisterSectionConfigView
                    isModalOpen={isModalOpen}
                    onCloseModal={() => setIsModalOpen(false)}
                />

                <EditTabModal
                    isOpen={isEditModalOpen}
                    initialData={{
                        tabName: tabDetails.tab_name,
                        description: tabDetails.description
                    }}
                    onClose={() => setIsEditModalOpen(false)}
                />

            </div>
        </div>
    );
};

export default TabConfigurationPage;
