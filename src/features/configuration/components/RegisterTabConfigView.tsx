'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AddTabModal from './AddTabModal';
import { useParams } from 'next/navigation';

import { useConfigTabs } from '../hooks/useConfigTabs';

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
	const { tabs, loading, refresh } = useConfigTabs(registerId);

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8 bg-white rounded-[30px] mx-7.5">
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
							Tab ID
						</div>
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Tab Name
						</div>
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Tab Order
						</div>

						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Actions
						</div>

					</div>

					{/* Data Rows */}
					{tabs.map((tab, index) => (
						<Link
							key={tab.tab_id}
							href={`/configuration/registers/${registerId}/tabs/${tab.tab_id}`}
							className="block -mx-8"
						>
							<div
								className={`grid grid-cols-4 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
									} cursor-pointer`}
							>  
							    <div className="text-base font-medium">
									{tab.tab_id}
								</div>
								<div className="text-base font-medium">
									{tab.tab_label}
								</div>
								<div className="text-base font-medium text-gray-500">
									{tab.tab_order}
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
				onSuccess={refresh}
			/>
		</>
	);
}

