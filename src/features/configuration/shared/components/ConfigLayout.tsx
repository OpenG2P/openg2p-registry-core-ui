'use client';

import ConfigSidebar from './ConfigSidebar';
import { ReactNode } from 'react';

export type ConfigActiveOption =
    | "registry"
    | "registers"
    | "data-models"
    | "ingest-configurations"
    | "outgest-configurations"

interface ConfigLayoutProps {
    children: ReactNode;
    activeOption: ConfigActiveOption;
}

export const ConfigLayout = ({ children, activeOption }: ConfigLayoutProps) => {
    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4] flex">
            <div className="mt-4">
                <ConfigSidebar activeOption={activeOption} />
            </div>
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default ConfigLayout;
