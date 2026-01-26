'use client';

import { useState } from 'react';
import { TopBar } from '@/components/shared';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import RegistersConfigView from '@/features/configuration/components/RegistersConfigView';

const RegistersConfigurationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageStart: 1,
    pageEnd: 12,
    total: 250_000_000,
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
        <TopBar
          breadcrumb={[{ label: "Registers" }]}
          showFilters={false}
          showPagination
          showAddNewButton
          addNewButtonText={"Add New Register"}
          onAddNewButton={() => setIsModalOpen(true)}
          pageStart={pagination.pageStart}
          pageEnd={pagination.pageEnd}
          total={pagination.total}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <RegistersConfigView
          onAddNewRegister={() => setIsModalOpen(true)}
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
        />

      </div>
    </div>
  );
};

export default RegistersConfigurationPage;
