import { Link } from '@/i18n/navigation';
import Image from 'next/image';

interface SidebarOption {
  id: string;
  label: string;
  iconUrl: string;
  path: string;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 'registry',
    label: 'Registry',
    iconUrl: "/config/menu_registry_01.png",
    path: '/configuration/registry'
  },
  {
    id: 'registers',
    label: 'Registers',
    iconUrl: "/config/menu_registers_02.png",
    path: '/configuration/registers'
  },
  {
    id: 'data-models',
    label: 'Data Models',
    iconUrl: "/config/menu_data_models_03.png",
    path: '/configuration/data-models'
  },
  {
    id: 'ingest-configurations',
    label: 'Ingest Configurations',
    iconUrl: "/config/menu_ingest_config_04.png",
    path: '/configuration/ingest-configurations'
  },
  {
    id: 'outgest-configurations',
    label: 'Outgest Configurations',
    iconUrl: "/config/menu_outgest_config_05.png",
    path: '/configuration/outgest-configurations'
  }
];

export default function ConfigSidebar({ activeOption }: { activeOption: string }) {
  return (
    <div className="w-[100%] h-[100%] bg-[#F2BA1A] rounded-r-[30px] p-4 pt-8">
      <div className="space-y-2">
        {sidebarOptions.map((option) => (
          <Link
            key={option.id}
            href={option.path}
            className="relative cursor-pointer rounded-full block"
          >
            {activeOption === option.id && (
              <div className="absolute inset-0 bg-[#ffd54c] rounded-full" />
            )}
            <div className="relative flex items-center px-4 py-3 z-10">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${activeOption === option.id ? 'bg-black' : 'bg-white'}
              `}>
                <div className="flex items-center justify-center">
                  <Image
                    src={option.iconUrl}
                    alt={option.label}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="ml-3 text-base font-medium">
                {option.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
