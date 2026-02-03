'use client';

import ConfigSidebar from './ConfigSidebar';
import { ReactNode } from 'react';

interface ConfigLayoutProps {
    children: ReactNode;
    activeOption: "registry" | "registers" | "tabs" | "sections" | "status" | "actions";
}

export const ConfigLayout = ({ children, activeOption }: ConfigLayoutProps) => {
    return (
        <div className="min-h-screen mx-auto bg-[#F3F1E4] flex">
            <div className="mt-4">
                <ConfigSidebar activeOption={activeOption} />
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default ConfigLayout;
