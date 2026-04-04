import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface SubOption {
    id: string;
    label: string;
    path: string;
}

interface SidebarOption {
    id: string;
    label: string;
    iconUrl: string;
    path: string;
    subOptions?: SubOption[];
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 'registry',
        label: 'registry',
        iconUrl: "/images/config/menu_registry_01.png",
        path: '/configuration/registry'
    },
    {
        id: 'registers',
        label: 'registers',
        iconUrl: "/images/config/menu_registers_02.png",
        path: '/configuration/registers'
    },
    {
        id: 'data-models',
        label: 'data_models',
        iconUrl: "/images/config/menu_data_models_03.png",
        path: '/configuration/data-models'
    },
    {
        id: 'ingest-configurations',
        label: 'ingest_configurations',
        iconUrl: "/images/config/menu_ingest_config_04.png",
        path: '/configuration/ingest-configurations',
        subOptions: [
            { id: 'ingest-partners', label: 'ingest_partners', path: '/configuration/ingest-configurations/partners' },
            { id: 'ingest-signature-paths', label: 'ingest_signature_paths', path: '/configuration/ingest-configurations/signature-paths' },
            { id: 'ingest-symmetric-expressions', label: 'ingest_symmetric_expressions', path: '/configuration/ingest-configurations/symmetric-expressions' },
            { id: 'ingest-templates', label: 'ingest_templates', path: '/configuration/ingest-configurations/templates' },
            { id: 'ingest-payload-enrichers', label: 'ingest_payload_enrichers', path: '/configuration/ingest-configurations/payload-enrichers' },
        ]
    },
    {
        id: 'outgest-configurations',
        label: 'outgest_configurations',
        iconUrl: "/images/config/menu_outgest_config_05.png",
        path: '/configuration/outgest-configurations',
        subOptions: [
            { id: 'outgest-topics', label: 'outgest_topics', path: '/configuration/outgest-configurations/topics' },
            { id: 'outgest-templates', label: 'outgest_templates', path: '/configuration/outgest-configurations/templates' },
        ]
    }
];

export default function ConfigSidebar({ activeOption }: { activeOption: string }) {
    const t = useTranslations();
    return (
        <div className="w-full h-full bg-[#F2BA1A] rounded-r-[10px] p-4 pt-8">
            <div className="space-y-2">
                {sidebarOptions.map((option) => {
                    const isParentActive = activeOption === option.id;
                    const isSubOptionActive = option.subOptions?.some(sub => activeOption === sub.id);
                    const isActive = isParentActive || isSubOptionActive;

                    return (
                        <div key={option.id} className="relative">
                            {isActive && (
                                <div className="absolute inset-0 bg-[#ffd54c] rounded-[10px]" />
                            )}
                            <div className="relative z-10">
                                <Link
                                    href={option.path}
                                    className="flex items-center px-4 py-3 cursor-pointer"
                                >
                                    <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${isActive ? 'bg-black' : 'bg-white'}
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
                                    <span className={`ml-3 text-base font-medium leading-tight ${isActive ? 'font-bold' : ''} max-w-30`}>
                                        {t(option.label)}
                                    </span>
                                </Link>

                                {isActive && option.subOptions && (
                                    <div className="ml-14 pb-4 pr-4 space-y-2">
                                        {option.subOptions.map((sub, index) => (
                                            <Link
                                                key={sub.id}
                                                href={sub.path}
                                                className={`block text-sm transition-colors ${(activeOption === sub.id || (isParentActive && index === 0))
                                                    ? 'text-white font-bold'
                                                    : 'text-black font-medium hover:text-white'
                                                    }`}
                                            >
                                                {t(sub.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
