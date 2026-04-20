'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { AddTabModal, IntakeFormModal } from '@/features/configuration/registers';
import { useParams } from 'next/navigation';
import { useConfigTabs } from '../shared/hooks/useConfigTabs';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { CONFIGURATION_TABS_ACTIONS } from '../shared/utils/configurationTabs.actions';
import Can from '@/components/shared/Can';
import ConfirmRemovePopup from '../shared/components/ConfirmRemovePopup';

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
	const t = useTranslations();
	const { registerId } = useParams<{ registerId: string }>();
	const { tabs, loading, refresh, pagination } = useConfigTabs(registerId, page, pageSize);
	const [showPopup, setShowPopup] = useState(false);
	const [selectedTabId, setSelectedTabId] = useState<string | null>(null);


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
			toast.success(t('toast_tab_removed'));
			refresh();
		} else {
			toast.error(t('toast_tab_remove_failed'));
		}
	};

	const handleDelete = (e: React.MouseEvent, tabId: string) => {
		e.preventDefault();
		e.stopPropagation();

		setSelectedTabId(tabId);
		setShowPopup(true);
	};

	const confirmDelete = async () => {
		if (!selectedTabId) return;

		await proceedDelete(selectedTabId);

		setShowPopup(false);
		setSelectedTabId(null);
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
					<div className="grid grid-cols-5 gap-4 pb-2 px-4">
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							{t('tab_label')}
						</div>
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							{t('tab_order')}
						</div>
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							{t('used_for_intake')}
						</div>
						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							Status
						</div>

						<div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
							{t('actions')}
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
								className={`grid grid-cols-5 h-15 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
									} cursor-pointer`}
							>

								<div className="text-base font-medium">
									{tab.tab_label || tab.intake_form_name}
								</div>
								<div className="text-base font-medium text-gray-500">
									{tab.tab_order}
								</div>
								<div className="text-base font-medium text-gray-500">
									{tab.used_for_new_intake_form ? t('true') : t('false')}
								</div>
								<div className="text-base font-medium text-gray-500">
									{tab.is_active ? t('active') : t('inactive')}
								</div>

								<div className="text-base font-medium">
									<Can action={CONFIGURATION_TABS_ACTIONS.delete}>
										<span
											onClick={(e) => handleDelete(e, tab.tab_id)}
											className="flex items-center text-[#00000080]"
										>
											{t('remove')}
											<Image
												src="/images/common/false_sign.png"
												alt={t('remove')}
												width={18}
												height={18}
												className="ml-4"
											/>
										</span>
									</Can>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{showPopup && (
				<ConfirmRemovePopup
					onClose={() => {
						setShowPopup(false);
						setSelectedTabId(null);
					}}
					onConfirm={confirmDelete}
					messageKey="confirm_remove_tab"
				/>
			)}

			{isModalOpen && (
				<AddTabModal
					onClose={onCloseModal}
					onSuccess={refresh}
				/>
			)}

			{isIntakeModalOpen && (
				<IntakeFormModal
					onClose={onCloseIntakeModal}
					onSuccess={refresh}
				/>
			)}
		</>
	);
}

