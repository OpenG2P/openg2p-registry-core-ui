'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { AddTabModal, IntakeFormModal } from '@/features/configuration/registers';
import { useParams } from 'next/navigation';
import { useConfigTabs } from '../shared/hooks/useConfigTabs';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

interface RegisterTabConfigViewProps {
	onAddNewRegister: () => void;
	isModalOpen: boolean;
	onCloseModal: () => void;
	isIntakeModalOpen: boolean;
	onCloseIntakeModal: () => void;
	registerTabId?: string;
	page?: number;
	pageSize?: number;
	onDataLoaded?: (totalItems: number, currentCount: number) => void;
}

export default function RegisterTabConfigView({
	isModalOpen,
	onCloseModal,
	isIntakeModalOpen,
	onCloseIntakeModal,
	page = 1,
	pageSize = 10,
	onDataLoaded,
}: RegisterTabConfigViewProps) {
	const { registerId } = useParams<{ registerId: string }>();
	const { tabs, loading, refresh, pagination } = useConfigTabs(registerId, page, pageSize);


	// Effect to notify parent of pagination info
	useEffect(() => {
		if (pagination && onDataLoaded) {
			onDataLoaded(pagination.number_of_items, tabs.length);
		}
	}, [pagination, tabs.length, onDataLoaded]);


	const { execute: deleteTab } = useFetch();

	const proceedDelete = async (tabId: string) => {
		const result = await deleteTab('/api/configuration/registers/tabs/delete', {
			method: 'POST',
			body: JSON.stringify({ tab_id: tabId })
		});

		if (result) {
			toast.success('Tab removed successfully');
			refresh();
		} else {
			toast.error('Failed to remove tab');
		}
	};

	const handleDelete = (e: React.MouseEvent, tabId: string) => {
		e.preventDefault();
		e.stopPropagation();

		toast.info(
			({ closeToast }) => (
				<div className="p-1">
					<p className="font-bold text-gray-800 mb-3">Are you sure to remove this tab?</p>
					<div className="flex gap-3">
						<button
							onClick={async () => {
								closeToast();
								await proceedDelete(tabId);
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
			<div className="flex items-center justify-center p-8 bg-white rounded-[10px] mx-7.5">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED7C22]"></div>
			</div>
		);
	}

	return (
		<>
			<div className="mx-7.5 bg-white rounded-[10px] p-8 overflow-x-visible">
				<div>
					{/* Header */}
					<div className="grid grid-cols-3 gap-4 pb-2 px-4">
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Tab Label
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
								className={`grid grid-cols-3 h-15 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
									} cursor-pointer`}
							>

								<div className="text-base font-medium">
									{tab.tab_label || tab.intake_form_name}
								</div>
								<div className="text-base font-medium text-gray-500">
									{tab.tab_order}
								</div>

								<div className="text-base font-medium">
									<span
										onClick={(e) => handleDelete(e, tab.tab_id)}
										className="flex items-center text-[#00000080]"
									>
										Remove
										<Image
											src="/images/common/false_sign.png"
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
			<IntakeFormModal
				isOpen={isIntakeModalOpen}
				onClose={onCloseIntakeModal}
				onSuccess={refresh}
			/>
		</>
	);
}

