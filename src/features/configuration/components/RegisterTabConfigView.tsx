'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AddTabModal from './AddTabModal';
import { useParams } from 'next/navigation';

export const TAB_MOCK_DATA = [
	{
		tab_id: '550e8400-e29b-41d4-a716-44665544000001',
		tab_name: "FarmerInfoTab",
		description: 'Description text...',
	},
	{
		tab_id: '550e8400-e29b-41d4-a716-44665544000002',
		tab_name: 'Crops',
		description: 'Description text...',

	},
	{
		tab_id: '550e8400-e29b-41d4-a716-44665544000003',
		tab_name: 'Land',
		description: 'Description text...',
	},
];

interface RegisterTabConfigViewProps {
	onAddNewRegister: () => void;
	isModalOpen: boolean;
	onCloseModal: () => void;
	registerTabId?: string; // Add registerId prop
}

export default function RegisterTabConfigView({
	isModalOpen,
	onCloseModal,
}: RegisterTabConfigViewProps) {
	const { registerId } = useParams<{ registerId: string }>();

	return (
		<>
			<div className="mx-7.5 bg-white rounded-[30px] p-8 overflow-x-visible">
				<div className="space-y-2">
					{/* Header */}
					<div className="grid grid-cols-3 gap-4 pb-2 px-4">
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Tab Name
						</div>
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Description
						</div>

						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Actions
						</div>

					</div>

					{/* Data Rows */}
					{TAB_MOCK_DATA.map((tab, index) => (
						<Link
							key={tab.tab_id}
							href={`/configuration/registers/${registerId}/tabs/${tab.tab_id}`}
							className="block -mx-8"
						>
							<div
								className={`grid grid-cols-3 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
									} cursor-pointer`}
							>
								<div className="text-base font-medium">
									{tab.tab_name}
								</div>
								<div className="text-base font-medium text-gray-500">
									{tab.description}
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

			<AddTabModal
				isOpen={isModalOpen}
				onClose={onCloseModal}
			/>
		</>
	);
}

