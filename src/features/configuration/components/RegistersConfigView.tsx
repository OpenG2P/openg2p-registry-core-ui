'use client';

import { Link } from '@/i18n/navigation';
import AddRegisterModal from './AddRegisterModal';
import { Register } from '../types';

import Image from 'next/image';

import { useFetch } from '@/shared/hooks';

import { toast } from 'react-toastify';

interface RegistersConfigViewProps {
  registers: Register[];
  loading: boolean;
  refresh: () => void;
  onAddNewRegister: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  registerId?: string;
}

export default function RegistersConfigView({
  registers,
  loading,
  refresh,
  isModalOpen,
  onCloseModal,
}: RegistersConfigViewProps) {
  const { execute: deleteRegister } = useFetch();

  const proceedDelete = async (id: string, name: string) => {
    try {
      const result = await deleteRegister('/api/configuration/registers/delete', {
        method: 'POST',
        body: JSON.stringify({ register_id: id })
      });

      if (result) {
        toast.success(`Register "${name}" deleted successfully`);
        refresh();
      } else {
        toast.error('Failed to delete register');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the register');
    }
  };
  console.log(registers, "registers*******************");

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();

    toast.info(
      ({ closeToast }) => (
        <div className="p-1">
          <p className="font-bold text-gray-800 mb-3">Are you sure you want to delete the register "{name}"?</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                closeToast();
                await proceedDelete(id, name);
              }}
              className="bg-[#ED7C22] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#d66a1a] transition-colors shadow-sm"
            >
              Remove
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: 'rounded-[15px] shadow-xl border border-gray-100',
      }
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-7.5 bg-white rounded-[30px] p-4 pt-8 overflow-hidden">
        <div>
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 pb-2 px-8 border-b border-gray-100">
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Icon
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Mnemonic
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Master Register
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Rank
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Purpose
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Actions
            </div>
          </div>

          {/* Data Rows */}
          {registers.map((register, index) => (
            <Link
              key={register.register_id}
              href={`/configuration/registers/${register.register_id}`}
              className="block -mx-8"
            >
              <div
                className={`grid grid-cols-6 gap-4 items-center px-16 h-[60px] transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                  } cursor-pointer`}
              >
                <div className="text-base font-medium flex items-center">
                  {register.register_icon ? (
                    <Image
                      src={register.register_icon.startsWith('data:') ? register.register_icon : `data:image/png;base64,${register.register_icon}`}
                      alt={register.register_mnemonic}
                      width={40}
                      height={40}
                      className="rounded-md object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 border border-gray-200 rounded-md" />
                  )}
                </div>

                <div className="text-base font-medium truncate">
                  {register.register_mnemonic}
                </div>
                <div className="text-base font-medium truncate">
                  {register.master_register_mnemonic}
                </div>
                <div className="text-base font-medium">
                  {register.register_rank}
                </div>
                <div className="text-base font-medium truncate">
                  {register.register_purpose}
                </div>
                <div className="text-base font-medium">
                  <span
                    onClick={(e) => handleDelete(e, register.register_id, register.register_mnemonic)}
                    className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80"
                  >
                    Remove
                    <Image
                      src="/config/falseSign.png"
                      alt="Remove"
                      width={18}
                      height={18}
                      className="ml-4"
                    />
                  </span>
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
