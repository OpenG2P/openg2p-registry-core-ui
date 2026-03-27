'use client';

import { usePathname } from 'next/navigation';
import { ConfigLayout, type ConfigActiveOption } from '@/features/configuration/shared';
import RequireAction from '@/components/shared/RequireAction';
import { CONFIG_VIEW_ACTIONS } from '@/features/configuration/shared/utils/configurationView.actions';

const SIDEBAR_OPTIONS: ConfigActiveOption[] = ['registry', 'registers', 'data-models', 'ingest-configurations', 'outgest-configurations'];

function getActiveOptionFromPathname(pathname: string | null): ConfigActiveOption {
    if (!pathname) return 'registers';
    const segments = pathname.split('/');
    const configIndex = segments.indexOf('configuration');
    const segment = configIndex >= 0 && configIndex < segments.length - 1
        ? segments[configIndex + 1]
        : '';
    const option = segment as ConfigActiveOption;
    return SIDEBAR_OPTIONS.includes(option) ? option : 'registers';
}

export default function ConfigurationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const activeOption = getActiveOptionFromPathname(pathname);

    return (
        <RequireAction anyOf={CONFIG_VIEW_ACTIONS}>
            <ConfigLayout activeOption={activeOption}>
                {children}
            </ConfigLayout>
        </RequireAction>
    );
}
