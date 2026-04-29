'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { useFetch } from '@/shared/hooks';
import Can from '@/components/shared/Can';

import { CONFIGURATION_SECTIONS_ACTIONS } from '../shared/utils/configurationSections.actions';
import { Link } from '@/i18n/navigation';
import { useAllRegisterSections } from '../shared/hooks/useAllRegisterSections';
import AddRegisterSectionModal from './AddRegisterSectionModal';

interface RegisterSectionConfigViewProps {
	page?: number;
	pageSize?: number;
	onDataLoaded?: (totalItems: number, currentCount: number) => void;
	isModalOpen: boolean;
	onCloseModal: () => void;
}

export default function RegisterSectionConfigView({
	page = 1,
	pageSize = 10,
	onDataLoaded,
	isModalOpen,
	onCloseModal,
}: RegisterSectionConfigViewProps) {

	const t = useTranslations();
	const { registerId } = useParams<{ registerId: string }>();

	const { sections, loading, pagination, refresh } = useAllRegisterSections(registerId, page, pageSize);

	useEffect(() => {
		if (pagination && onDataLoaded) {
			onDataLoaded(pagination.number_of_items, sections?.length || 0);
		}
	}, [pagination, sections?.length, onDataLoaded]);

	const { execute: deleteSection } = useFetch();

	const proceedDelete = async (sectionId: string) => {
		const result = await deleteSection(
			'/api/configuration/registers/section-metadata/delete-section',
			{
				method: 'POST',
				body: JSON.stringify({ section_id: sectionId })
			}
		);

		if (result) {
			toast.success(t('toast_section_removed'));
			refresh();
		} else {
			toast.error(t('toast_section_remove_failed'));
		}
	};

	const handleDelete = (e: React.MouseEvent, sectionId: string) => {
		e.preventDefault();
		e.stopPropagation();

		toast.info(
			({ closeToast }) => (
				<div className="p-1">
					<p className="font-bold mb-3">
						{t('confirm_remove_section')}
					</p>

					<div className="flex gap-3">
						<button
							onClick={async () => {
								closeToast();
								await proceedDelete(sectionId);
							}}
							className="bg-primary-second text-neutral-second px-4 py-1.5 rounded-full text-sm font-semibold"
						>
							{t('remove')}
						</button>

						<button
							onClick={closeToast}
							className="bg-secondary-first px-4 py-1.5 rounded-full text-sm font-semibold"
						>
							{t('cancel')}
						</button>
					</div>
				</div>
			),
			{
				autoClose: false,
				closeButton: false,
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
			<div className="mx-7.5 bg-neutral-second rounded-[10px] p-8">
				<div className="grid grid-cols-4 gap-4 px-4 pb-2">
					<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider truncate">
						{t('section_mnemonic')}
					</div>
					<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
						{t('section_description')}
					</div>
					<div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
						{t('actions')}
					</div>
				</div>

				{sections?.map((section: any, index: number) => (
					<Link
						key={section.section_id}
						href={`/configuration/registers/${registerId}/sections/${section.section_id}`}
						className="block -mx-8"
					>
						<div
							className={`grid grid-cols-4 px-12 py-4 ${index % 2 === 0
								? 'bg-secondary-second/25'
								: 'bg-neutral-second'
								}`}
						>
							<div className="text-base font-medium truncate">
								{section.section_mnemonic}
							</div>

							<div className="text-base font-medium truncate">
								{section.section_description}
							</div>

							<div>
								<Can action={CONFIGURATION_SECTIONS_ACTIONS.delete}>
									<span
										onClick={(e) =>
											handleDelete(e, section.section_id)
										}
										className="flex items-center text-neutral-first/50 cursor-pointer"
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
			<AddRegisterSectionModal
				isOpen={isModalOpen}
				onClose={onCloseModal}
				onSuccess={refresh}
			/>
		</>
	);
}