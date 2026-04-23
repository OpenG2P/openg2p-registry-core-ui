'use client';

import { usePathname } from 'next/navigation';
import { ConfigLayout, type ConfigActiveOption } from '@/features/configuration/shared';
import RequireAction from '@/components/shared/RequireAction';
import { CONFIG_VIEW_ACTIONS } from '@/features/configuration/shared/utils/configurationView.actions';

const SIDEBAR_OPTIONS: ConfigActiveOption[] = [
    'registry', 'registers', 'data-models', 'ingest-configurations', 'outgest-configurations',
    'ingest-key-paths', 'ingest-semantic-patterns', 'ingest-manage-subscription',
    'outgest-topics', 'outgest-templates'
];

function getActiveOptionFromPathname(pathname: string | null): ConfigActiveOption {
    if (!pathname) return 'registers';
    const segments = pathname.split('/').filter(Boolean);
    const configIndex = segments.indexOf('configuration');

    if (configIndex === -1 || configIndex === segments.length - 1) return 'registers';

    const parentSegment = segments[configIndex + 1];
    const subSegment = segments[configIndex + 2];

    if (subSegment) {
        if (parentSegment === 'ingest-configurations') {
            if (subSegment === 'key-paths') return 'ingest-key-paths';
            if (subSegment === 'semantic-patterns') return 'ingest-semantic-patterns';
            if (subSegment === 'manage-subscription') return 'ingest-manage-subscription';
            if (subSegment === 'templates') return 'ingest-templates';
        }
        if (parentSegment === 'outgest-configurations') {
            if (subSegment === 'topics') return 'outgest-topics';
            if (subSegment === 'templates') return 'outgest-templates';
        }
    }

    const option = parentSegment as ConfigActiveOption;
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
