'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AddSectionModal from './AddSectionModal';

import { useParams } from 'next/navigation';

export const SECTION_MOCK_DATA = [
    {
        section_id: '550e8400-e29b-41d4-a716-44665544000011',
        section_name: "PersonalInfo",
        description: 'Personal details section...',
    },
    {
        section_id: '550e8400-e29b-41d4-a716-44665544000012',
        section_name: 'Contact Details',
        description: 'Contact information section...',

    },
    {
        section_id: '550e8400-e29b-41d4-a716-44665544000013',
        section_name: 'Education',
        description: 'Education history section...',
    },
];

interface RegisterSectionConfigViewProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
}

export default function RegisterSectionConfigView({
    isModalOpen,
    onCloseModal,
}: RegisterSectionConfigViewProps) {
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();

    return (
        <>
            <div className="mx-7.5 bg-white rounded-[30px] p-8 overflow-x-visible">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-3 gap-4 pb-2 px-4">
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Section Name
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Description
                        </div>

                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            Actions
                        </div>

                    </div>

                    {/* Data Rows */}
                    {SECTION_MOCK_DATA.map((section, index) => (
                        <Link
                            key={section.section_id}
                            href={`/configuration/registers/${registerId}/tabs/${tabId}/sections/${section.section_name}`}
                            className="block -mx-8"
                        >
                            <div
                                className={`grid grid-cols-3 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
                                    } cursor-pointer`}
                            >
                                <div className="text-base font-medium">
                                    {section.section_name}
                                </div>
                                <div className="text-base font-medium text-gray-500">
                                    {section.description}
                                </div>

                                <div className="text-base font-medium">
                                    <span className="flex items-center text-[#1cc9b7]">
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

            <AddSectionModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
            />
        </>
    );
}
