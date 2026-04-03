'use client';

import { useState } from 'react';
import { TopBar } from '@/components/shared';
import Image from 'next/image';
import { EditRegistry } from '@/features/configuration/registry';
import { useFetch } from '@/shared/hooks/useFetch';
import { convertImageToBase64 } from '@/features/configuration/shared';
import { toast } from 'react-toastify';
import Can from '@/components/shared/Can';
import { CONFIGURATION_REGISTRY_ACTIONS } from '@/features/configuration/shared/utils/configurationRegistry.actions';
import { useTranslations } from 'next-intl';

const RegistryConfigurationPage = () => {
	const t = useTranslations();
	const [isEditing, setIsEditing] = useState(false);
	const [configurationId, setConfigurationId] = useState<string | null>(null);
	const [registryName, setRegistryName] = useState(t('registry_name'));
	const [image, setImage] = useState('/images/config/blank_image.png');

	const { data: registryData, execute: fetchRegistry } = useFetch({ url: '/api/configuration/registry/get' });
	const { execute: saveRegistry } = useFetch();


	// Update local state when we enter edit mode
	const startEditing = () => {
		if (registryData) {
			setConfigurationId(registryData.configuration_id);
			setRegistryName(registryData.registry_name || t('registry_name'));
			setImage(registryData.registry_logo || '/images/config/blank_image.png');
		}
		setIsEditing(true);
	};

	const handleSave = async (newName: string, newImage: string) => {
		const base64Logo = await convertImageToBase64(newImage);

		const endpoint = configurationId || registryData?.configuration_id
			? '/api/configuration/registry/update'
			: '/api/configuration/registry/create';

		const payload = configurationId || registryData?.configuration_id
			? { configuration_id: configurationId || registryData?.configuration_id, registry_name: newName, registry_logo: base64Logo }
			: { registry_name: newName, registry_logo: base64Logo };

		const result = await saveRegistry(endpoint, {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (result?.configuration_id) {
			setConfigurationId(result.configuration_id);
			setRegistryName(newName);
			setImage(newImage);
			setIsEditing(false);
			toast.success(t('toast_registry_config_saved'));
			fetchRegistry(); // Refresh view data
		} else {
			toast.error(t('toast_registry_config_save_failed'));
		}
	};

	return (
		<>
			<TopBar
				breadcrumb={[{ label: t('registry') }]}
				showFilters={false}
				showPagination={false}
				showAddNewButton={false}
			/>

			<div className="mx-8 mt-4 ">
				{isEditing ? (
					<EditRegistry
						initialName={registryName}
						initialImage={image}
						onSave={handleSave}
						onCancel={() => setIsEditing(false)}
					/>
				) : (
					<div className="bg-white rounded-[10px] p-12">
						<div className="flex items-center gap-6">
							<div className="w-25 h-25 relative shrink-0 rounded overflow-hidden flex items-center justify-center">
								<Image
									src={registryData?.registry_logo || image}
									alt={t('registry_logo_alt')}
									width={100}
									height={100}
									className="object-contain w-full h-full"
									unoptimized
								/>
							</div>
							<div className="flex items-center gap-4">
								<div className='flex flex-col items-start gap-2'>
									<span className='text-black text-[16px] font-normal  tracking-normal m-0'>{t('registry_name')}</span>
									<h1 className="text-[#ED7C22] text-xl m-0">
										{registryData?.registry_name || registryName}
									</h1>
								</div>
								<Can action={CONFIGURATION_REGISTRY_ACTIONS.edit}>
									<div
										onClick={startEditing}
										className='bg-[#D9D9D980] h-8 w-8 rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#D9D9D9CC] transition-colors'
									>
										<Image
											src={"/images/config/pencil_icon.png"}
											alt={t('pencil_icon_alt')}
											width={18}
											height={18}
										/>
									</div>
								</Can>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default RegistryConfigurationPage;

