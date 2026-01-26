import { Database, Download, Upload } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface SidebarOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const sidebarOptions: SidebarOption[] = [
   {
    id: 'registry',
    label: 'Registry',
    icon: <Database size={20} />,
    path: '/configuration/registry'
  },
  {
    id: 'registers',
    label: 'Registers',
    icon: <Database size={20} />,
    path: '/configuration/registers'
  },
  {
    id: 'data-models',
    label: 'Data Models',
    icon: <Database size={20} />,
    path: '/configuration/data-models'
  },
  {
    id: 'ingest-configurations',
    label: 'Ingest Configurations',
    icon: <Download size={20} />,
    path: '/configuration/ingest-configurations'
  },
  {
    id: 'outgest-configurations',
    label: 'Outgest Configurations',
    icon: <Upload size={20} />,
    path: '/configuration/outgest-configurations'
  }
];

export default function ConfigSidebar({ activeOption }: { activeOption: string }) {
  return (
    <div className="w-[240px] h-[910px] bg-[#F2BA1A] rounded-r-[30px] p-4 pt-8">
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
                <div className={`${activeOption === option.id ? 'text-white' : 'text-black'}`}>
                  {option.icon}
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
