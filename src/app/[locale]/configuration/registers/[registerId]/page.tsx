'use client';

import { useState } from 'react';
import { BreadcrumbBar, TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import EditRegisterModal from '@/features/configuration/components/EditRegisterModal';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import { getRegisterDetails } from '@/features/configuration/utils/configUtils';
import ViewRegisterFieldsModal from '@/features/configuration/components/ViewRegisterFieldsModal';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { usePagination } from '@/shared/hooks';
import RegisterTabConfigView from '@/features/configuration/components/RegisterTabConfigView';
import RegisterSchemaView from '@/features/configuration/components/RegisterSchemaView';
import ConfigurationTabs from '@/features/configuration/components/ConfigurationTabs';


const RegisterConfigurationPage = () => {
  const { registerId } = useParams<{ registerId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tabs' | 'filter' | 'search' | 'deduplication'>('tabs');

  const { registers, loading, refresh } = useAllRegister(1, 100);
  const registerDetails = getRegisterDetails(registerId, registers);

  const tabLabels = {
    tabs: 'Tabs',
    filter: 'Filter Schema',
    search: 'Search Schema',
    deduplication: 'Deduplication Schema',
  };

  const breadcrumb = useBreadcrumb({
    rootItem: { label: 'Registers', href: '/configuration/registers' },
    customItems: [
      { label: registerDetails?.register_mnemonic || '', href: `/configuration/registers/${registerId}` },
      { label: tabLabels[activeTab], href: `/configuration/registers/${registerId}` }
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { config } = useRuntimeConfig();
  const PAGE_SIZE = config.pageSize || 10;
  const [paginationInfo, setPaginationInfo] = useState({ totalItems: 0, currentCount: 0 });

  const pagination = usePagination({
    currentPage,
    pageSize: PAGE_SIZE,
    totalItems: paginationInfo.totalItems,
    currentCount: paginationInfo.currentCount,
  });

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (loading || !registerDetails.register_id) {
    return (
      <div className="min-h-screen bg-[#F3F1E4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-10 px-7.5 mb-6">
        <BreadcrumbBar breadcrumb={breadcrumb} />
      </div>

      <ConfigDetailsSummary
        title={registerDetails?.register_mnemonic || 'None'}
        description={registerDetails?.register_description}
        extraInfo1={registerDetails?.master_register_id || 'None'}
        extraInfo2={registerDetails.register_purpose || 'None'}
        onEdit={() => setIsEditModalOpen(true)}
        onView={() => setIsViewModalOpen(true)}
      />

      <div className=" ml-4 mt-4 px-7.5">
        <div className="flex justify-between items-center h-14">
          <ConfigurationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabLabels={tabLabels}
          />

          {/* TopBar */}
          <div className="flex items-center h-full">
            <TopBar
              breadcrumb={[]}
              showFilters={false}
              showPagination={activeTab === 'tabs'}
              showAddNewButton={activeTab === 'tabs'}
              addNewButtonText="Add New Tab"
              onAddNewButton={() => setIsModalOpen(true)}
              pageStart={pagination.pageStart}
              pageEnd={pagination.pageEnd}
              total={pagination.total}
              onPrev={handlePrev}
              onNext={handleNext}
              showCapsule={false}
            />
          </div>
        </div>
      </div>


      {/* Tab Content */}
      <div className="mt-0">
        {activeTab === 'tabs' ? (
          <RegisterTabConfigView
            onAddNewRegister={() => setIsModalOpen(true)}
            isModalOpen={isModalOpen}
            onCloseModal={() => setIsModalOpen(false)}
            page={currentPage}
            pageSize={PAGE_SIZE}
            onDataLoaded={(totalItems, currentCount) => setPaginationInfo({ totalItems, currentCount })}
          />
        ) : (
          <RegisterSchemaView
            registerId={registerId}
            activeTab={activeTab as 'filter' | 'search' | 'deduplication'}
          />
        )}
      </div>

      <EditRegisterModal
        isOpen={isEditModalOpen}
        initialData={registerDetails as any}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refresh}
      />

      <ViewRegisterFieldsModal
        isOpen={isViewModalOpen}
        data={registerDetails as any}
        onClose={() => setIsViewModalOpen(false)}
      />
    </>
  );
};

export default RegisterConfigurationPage;
