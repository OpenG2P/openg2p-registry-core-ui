'use client';

import { useParams } from 'next/navigation';
import { CapsuleDropdown, RegisterTabsLayout } from '@/components/shared';
import { VerificationCard } from '@/features/change-request/components';
import { useTranslations } from 'next-intl';
import { useRegisterTabs } from '@/context/RegisterTabsContext';
import { useBreadcrumb } from '@/shared/hooks';
import { useVerifications } from '@/features/change-request/hooks';

export default function VersionHistoryPage() {
    const t = useTranslations();
    const { type, id } = useParams<{ type: string; id: string }>();

    const {
        tabs,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const { verifications } = useVerifications("changeId");

    const breadcrumb = useBreadcrumb({
        type,
        recordId: id,
        includeActiveTab: true,
        includeChangeRequest: false,
        customItems: [
            {
                label: t('versionHistory') ?? 'Version History',
                href: '#',
            },
        ],
    });

    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumb}
            tabs={{ tabs }}
            activeTab={activeTabIndex}
            onTabChange={setActiveTabByIndex}
        >
            <div className="flex gap-6">
                <div className="w-[75%] flex flex-col gap-6">
                    <div className="bg-white rounded-[30px] px-6 py-5 flex items-center gap-6">
                        <CapsuleDropdown
                            label="Select Date"
                            items={[
                                "01 Jan 2026",
                                "15 Jan 2026",
                                "30 Jan 2026",
                            ]}
                            onChange={(value) => console.log("Date:", value)}
                        />

                        <CapsuleDropdown
                            label="Select Version"
                            items={[
                                "v3",
                                "v2",
                                "v1",
                            ]}
                            onChange={(value) => console.log("Version:", value)}
                        />
                    </div>

                    <div className="bg-white rounded-[30px] p-6">
                        <p className="text-gray-700">
                            This is a placeholder for version history details.
                            You can replace this with change logs, diff viewer,
                            or timeline content later.
                        </p>
                    </div>
                </div>

                <div className="w-[25%] space-y-3">
                    {verifications.map((verification) => (
                        <VerificationCard
                            key={verification.verification_id}
                            verification={verification}
                        />
                    ))}
                </div>
            </div>
        </RegisterTabsLayout>
    );
}
