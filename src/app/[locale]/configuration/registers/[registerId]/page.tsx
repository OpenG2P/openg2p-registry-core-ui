'use client';

import { useState } from 'react';
import { TopBar, BreadcrumbBar } from '@/components/shared';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import { useParams } from 'next/navigation';
import RegisterTabConfigView from '@/features/configuration/components/RegisterTabConfigView';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { REGISTER_MOCK_DATA } from '@/features/configuration/components/RegistersConfigView';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import EditRegisterModal from '@/features/configuration/components/EditRegisterModal';

const RegisterConfigurationPage = () => {
  const { registerId } = useParams<{ registerId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageStart: 1,
    pageEnd: 12,
    total: 250_000_000,
  });

  const getRegisterDetails = (nameOrId: string) => {
    const registerData = REGISTER_MOCK_DATA.find(
      r => r.mnemonic.toLowerCase() === nameOrId.toLowerCase() || r.register_id === nameOrId
    );

    if (registerData) return registerData;

    return {
      mnemonic: nameOrId,
      description: `Register configuration for: ${nameOrId}`,
      parentRegister: 'Parent Registry'
    };
  };

  const registerDetails = getRegisterDetails(registerId);

  const breadcrumb = useBreadcrumb({
    rootItem: { label: 'Registers', href: '/configuration/registers' },
    customItems: [{ label: registerDetails.mnemonic, href: `/configuration/registers/${registerId}` }]
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
          title={registerDetails.mnemonic}
          description={registerDetails.description}
          extraInfo={registerDetails.parentRegister}
          status={true}
          selectionOptions={["Farmer", "Crop", "Land", "Livestock"]}
          onSave={(data) => console.log('Saved Register:', data)}
          onEdit={() => setIsEditModalOpen(true)}
        />

        <TopBar
          breadcrumb={[]}
          showFilters={false}
          showPagination={true}
          showAddNewButton={true}
          addNewButtonText={"Add New Tab"}
          onAddNewButton={() => setIsModalOpen(true)}
          pageStart={pagination.pageStart}
          pageEnd={pagination.pageEnd}
          total={pagination.total}
          onPrev={handlePrev}
          onNext={handleNext}
        />


        <RegisterTabConfigView
          onAddNewRegister={() => setIsModalOpen(true)}
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}

        />

        <EditRegisterModal
          isOpen={isEditModalOpen}
          initialData={{
            registerName: registerDetails.mnemonic,
            description: registerDetails.description,
            parentRegister: registerDetails.parentRegister,
            programApplication: true // Assuming true for now based on page props
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default RegisterConfigurationPage
  ;
