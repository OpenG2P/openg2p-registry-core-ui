'use client';

import { useState } from 'react';
import { TopBar } from '@/components/shared';
import RegistersConfigView from '@/features/configuration/components/RegistersConfigView';

import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import { usePagination } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';

const RegistersConfigurationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Env. variable config
  const { config } = useRuntimeConfig();

  const { registers, pagination, loading, refresh } = useAllRegister(currentPage, config.pageSize);

  const { pageStart, pageEnd, total } = usePagination({
    totalItems: pagination?.number_of_items || 0,
    currentPage: currentPage,
    pageSize: config.pageSize,
    currentCount: registers.length,
  });

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <TopBar
        breadcrumb={[{ label: "Registers" }]}
        showFilters={false}
        showPagination
        showAddNewButton
        addNewButtonText={"Add New Register"}
        onAddNewButton={() => setIsModalOpen(true)}
        pageStart={pageStart}
        pageEnd={pageEnd}
        total={total}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <RegistersConfigView
        registers={registers}
        loading={loading}
        refresh={refresh}
        onAddNewRegister={() => setIsModalOpen(true)}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />

    </>
  );
};


export default RegistersConfigurationPage;
