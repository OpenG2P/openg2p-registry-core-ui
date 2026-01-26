'use client';

import { TopBar } from '@/components/shared';
import ConfigSidebar from '@/features/configuration/components/ConfigSidebar';
import Image from 'next/image';

const RegistryConfigurationPage = () => {

	return (
		<div className="min-h-screen mx-auto bg-[#F3F1E4] flex">
			<div className="mt-4">
				<ConfigSidebar activeOption={"registry"} />
			</div>

			<div className="flex-1">
				<TopBar
					breadcrumb={[{ label: "Registry" }]}
					showFilters={false}
					showPagination={false}
					showAddNewButton={false}
				/>

				<div className="mx-8 mt-4">
					<div className="bg-white rounded-[30px] p-12">
						<div className="flex items-center gap-6">
							<Image
								src={"/config/blank_image.png"}
								alt='Blank Image'
								width={100}
								height={100}
							/>
							<h1 className="text-[#ED7C22] text-xl font-medium">
								Registry Name
							</h1>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
};

export default RegistryConfigurationPage;

