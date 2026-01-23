'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AddRegisterModal from './AddRegisterModal';
import { useParams } from 'next/navigation';

export const REGISTER_MOCK_DATA = [
  {
    register_id: '550e8400-e29b-41d4-a716-44665544000001',
    mnemonic: 'Farmer',
    description: 'Description text...',
    parentRegister: 'Parent Register Name',
    programApplication: true,
  },
  {
    register_id: '550e8400-e29b-41d4-a716-44665544000002',
    mnemonic: 'Crops',
    description: 'Description text...',
    parentRegister: 'Parent Register Name',
    programApplication: true,
  },
  {
    register_id: '550e8400-e29b-41d4-a716-44665544000003',
    mnemonic: 'Land',
    description: 'Description text...',
    parentRegister: 'Parent Register Name',
    programApplication: false,
  },
  {
    register_id: '550e8400-e29b-41d4-a716-44665544000004',
    mnemonic: 'Vehicle',
    description: 'Description text...',
    parentRegister: 'Parent Register Name',
    programApplication: true,
  },
  {
    register_id: '550e8400-e29b-41d4-a716-44665544000005',
    mnemonic: 'School',
    description: 'Description text...',
    parentRegister: 'Parent Register Name',
    programApplication: true,
  },
  {
    register_id: '550e8400-e29b-41d4-a716-44665544000006',
    mnemonic: 'Student',
    description: 'Description text...',
    parentRegister: 'Parent Register Name',
    programApplication: true,
  },
];

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
  const configType = 'registers';

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
              Parent Register
            </div>
            <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
              Program Application
            </div>
          </div>

          {/* Data Rows */}
          {REGISTER_MOCK_DATA.map((register, index) => (
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
                  {register.mnemonic}
                </div>
                <div className="text-base font-medium text-gray-500">
                  {register.description}
                </div>
                <div className="text-base font-medium text-gray-500">
                  {register.parentRegister}
                </div>
                <div className="text-base font-medium">
                  {register.programApplication ? (
                    <span className="flex items-center text-[#1cc9b7]">
                      Yes
                      <Image
                        src="/config/trueSign.png"
                        alt="Yes"
                        width={18}
                        height={18}
                        className="ml-4"
                      />
                    </span>
                  ) : (
                    <span className="flex items-center text-[#d31152]">
                      No
                      <Image
                        src="/config/falseSign.png"
                        alt="No"
                        width={18}
                        height={18}
                        className="ml-4"
                      />
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AddRegisterModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
      />
    </>
  );
}
