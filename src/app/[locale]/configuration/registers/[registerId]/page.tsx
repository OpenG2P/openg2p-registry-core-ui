'use client';

import { useState } from 'react';
import { BreadcrumbBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { useAllRegister } from '@/features/configuration/hooks/useAllRegister';
import EditRegisterModal from '@/features/configuration/components/EditRegisterModal';
import ConfigDetailsSummary from '@/features/configuration/components/ConfigDetailsSummary';
import RegisterTabsContent from '@/features/configuration/components/RegisterTabsContent';
import { getParentMnemonic, getRegisterDetails } from '@/features/configuration/utils/configUtils';

const RegisterConfigurationPage = () => {
  const { registerId } = useParams<{ registerId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tabs' | 'filter' | 'search'>('tabs');

  const { registers, loading, refresh } = useAllRegister(1, 100);
  const registerDetails = getRegisterDetails(registerId, registers);

  const breadcrumb = useBreadcrumb({
    rootItem: { label: 'Registers', href: '/configuration/registers' },
    customItems: [{ label: registerDetails.register_mnemonic, href: `/configuration/registers/${registerId}` }]
  });

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
        title={registerDetails.register_mnemonic}
        description={registerDetails.register_description}
        extraInfo={getParentMnemonic(registerDetails.master_register_id || null, registers)}
        status={true}
        selectionOptions={registers.map(r => r.register_mnemonic)}
        onSave={(data) => console.log('Saved Register:', data)}
        onEdit={() => setIsEditModalOpen(true)}
      />

      {/* Tab Navigation */}
      <div className="px-7.5 py-6">
        <div className="flex gap-2 px-10">
          <button
            onClick={() => setActiveTab('tabs')}
            className={`px-8 py-2 text-black text-[18px] font-medium rounded-t-[20px] transition-all ${activeTab === 'tabs'
              ? 'bg-[#F2BA1A]'
              : 'bg-[#DDDDDD]'
              }`}
          >
            Tabs
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-8 py-2 text-black text-[18px] font-medium rounded-t-[20px] transition-all ${activeTab === 'filter'
              ? 'bg-[#F2BA1A]'
              : 'bg-[#DDDDDD]'
              }`}
          >
            Filter Schema
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-8 py-2 text-black text-[18px] font-medium rounded-t-[20px] transition-all ${activeTab === 'search'
              ? 'bg-[#F2BA1A]'
              : 'bg-[#DDDDDD]'
              }`}
          >
            Search Schema
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'tabs' ? (
        <RegisterTabsContent registerId={registerId} />
      ) : (
        <div className="mx-7.5 mt-8">
          <div className="bg-white rounded-[30px] p-12 flex items-center justify-center min-h-[400px]">
            <p className="text-gray-400 text-lg">No content available</p>
          </div>
        </div>
      )}

      <EditRegisterModal
        isOpen={isEditModalOpen}
        initialData={registerDetails as any}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refresh}
      />

    </>
  );
};



export default RegisterConfigurationPage;
