'use client';

import { useState } from 'react';
import { TopBar, BreadcrumbBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import EditRegisterModal from '@/features/configuration/components/EditRegisterModal';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import RegisterTabConfigView from '@/features/configuration/components/RegisterTabConfigView';


const RegisterConfigurationPage = () => {
  const { registerId } = useParams<{ registerId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageStart: 1,
    pageEnd: 12,
    total: 250_000_000,
  });
  const { registers, loading } = useAllRegister();

  const currentRegister = registers.find((r) => r.register_id === registerId);

  const getParentMnemonic = (parentId: string | null) => {
    if (!parentId) return 'None';
    const parent = registers.find((r) => r.register_id === parentId);
    return parent ? parent.register_mnemonic : 'None';
  };

  const breadcrumb = useBreadcrumb({
    rootItem: { label: 'Registers', href: '/configuration/registers' },
    customItems: [{ label: currentRegister?.register_mnemonic || 'Loading...', href: `/configuration/registers/${registerId}` }]
  });

  if (loading || !currentRegister) {
    return (
      <div className="min-h-screen bg-[#F3F1E4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
      </div>
    );
  }

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
          title={currentRegister.register_mnemonic}
          description={currentRegister.register_description}
          extraInfo={getParentMnemonic(currentRegister.master_register_id)}
          status={true}
          selectionOptions={registers.map(r => r.register_mnemonic)}
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
            registerName: currentRegister.register_mnemonic,
            description: currentRegister.register_description,
            parentRegister: currentRegister.master_register_id || "",
            programApplication: true
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default RegisterConfigurationPage;
