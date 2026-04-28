'use client';

import { useEffect } from 'react';
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

		toast.info(
			({ closeToast }) => (
				<div className="p-1">
					<p className="font-bold text-neutral-first mb-3">{t('confirm_remove_tab')}</p>
					<div className="flex gap-3">
						<button
							onClick={async () => {
								closeToast();
								await proceedDelete(tabId);
							}}
							className="bg-primary-second text-neutral-second px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-second transition-colors shadow-sm"
						>
							{t('remove')}
						</button>
						<button
							onClick={closeToast}
							className="bg-secondary-first text-neutral-first/70 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-secondary-second transition-colors"
						>
							{t('cancel')}
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
				className: 'rounded-[15px] shadow-xl border border-secondary-first',
			}
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8 bg-neutral-second rounded-[10px] mx-7.5">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-second"></div>
			</div>
		);
	}

	return (
		<>
			<div className="mx-7.5 bg-neutral-second rounded-[10px] p-8 overflow-x-visible">
				<div>
					{/* Header */}
					<div className="grid grid-cols-5 gap-4 pb-2 px-4">
						<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
							{t('tab_label')}
						</div>
						<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
							{t('tab_order')}
						</div>
						<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
							{t('used_for_intake')}
						</div>
						<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
							Status
						</div>

						<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
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
								className={`grid grid-cols-5 h-15 gap-4 items-center px-12 py-4 transition-colors ${index % 2 === 0 ? 'bg-secondary-second/25' : 'bg-neutral-second'
									} cursor-pointer`}
							>

								<div className="text-base font-medium">
									{tab.tab_label || tab.intake_form_name}
								</div>
								<div className="text-base font-medium text-neutral-first/50">
									{tab.tab_order}
								</div>
								<div className="text-base font-medium text-neutral-first/50">
									{tab.used_for_new_intake_form ? t('true') : t('false')}
								</div>
								<div className="text-base font-medium text-neutral-first/50">
									{tab.is_active ? t('active') : t('inactive')}
								</div>

								<div className="text-base font-medium">
									<Can action={CONFIGURATION_TABS_ACTIONS.delete}>
										<span
											onClick={(e) => handleDelete(e, tab.tab_id)}
											className="flex items-center text-neutral-first/50"
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

