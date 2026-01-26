'use client';

import { Link } from '@/i18n/navigation';
import AddRegisterModal from './AddRegisterModal';
import { useAllRegister } from '../hooks/useAllRegister';

interface RegistersConfigViewProps {
  onAddNewRegister: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  registerId?: string;
}

export default function RegistersConfigView({
  isModalOpen,
  onCloseModal,
}: RegistersConfigViewProps) {
  const { registers, loading, refresh } = useAllRegister();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-7.5 bg-white rounded-[30px] p-8 overflow-x-visible">
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 pb-2 px-4">
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Mnemonic
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Description
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Master Register ID
            </div>
          </div>

          {/* Data Rows */}
          {(registers || []).map((register, index) => (
            <Link
              key={register.register_id}
              href={`/configuration/registers/${register.register_id}`}
              className="block -mx-8"
            >
              <div
                className={`grid grid-cols-4 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                  } cursor-pointer`}
              >
                <div className="text-base font-medium">
                  {register.register_mnemonic}
                </div>
                <div className="text-base font-medium text-gray-500">
                  {register.register_description}
                </div>
                <div className="text-base font-medium text-gray-500">
                  {register.master_register_id}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AddRegisterModal isOpen={isModalOpen} onClose={onCloseModal} onSuccess={refresh} />
    </>
  );
}
