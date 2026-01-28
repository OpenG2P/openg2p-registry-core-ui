'use client';

import { useTranslations } from 'next-intl';
import {
    RegisterTabsLayout,
    VersionHistoryCard,
} from '@/components/shared';
import {
    WidgetProvider,
    SectionsContainer,
} from '@openg2p/registry-widgets';
import ChangeRequestCard from '@/features/change-request/components/ChangeRequestCard';
import { useEffect, useState } from 'react';

import { useRegisterDetail } from '@/features/register/hooks/useRegisterDetail';
import RegisterDetailsPageSkeleton from '@/features/register/components/RegisterDetailsPageSkeleton';
import { apiAdapter } from '@/features/register/utils/apiAdapter';


export default function RegisterDetailPage() {
    const t = useTranslations();

    // state to update the count of pending change requests 
    const [changeRequestCount, setChangeRequestCount] = useState<number | undefined>(undefined);

    const {
        internalRecordId,
        registerType,
        widgetStore,
        tabs,
        activeTabIndex,
        setActiveTabByIndex,
        activeTabId,
        breadcrumb,
        orderedTabSections,
        sectionDataMap,
        handleSectionSave,
        canRenderContent,
        currentRegister
    } = useRegisterDetail(() => setChangeRequestCount(prevCount => (prevCount ?? 0) + 1));

    // Below commented code, only Testing for apiAdapter
    // Remove it if no required
    /*
        useEffect(() => {
        const testApi = async () => {
            const geoLevels = await apiAdapter(
            '/api/master-data/geo_levels',
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                parent_level_id: '',
                }),
            }
            );

            console.log('geoLevels ***************:', geoLevels);
        };

        testApi();
    }, []);
     
    */

    // resolvingId: resolves the functional ID 
    // from the internal record ID (UUID)
    const isLoading = !internalRecordId || !canRenderContent;
    const isNotFound = !internalRecordId;

    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumb}
            tabs={{ tabs }}
            activeTab={activeTabIndex}
            onTabChange={setActiveTabByIndex}
        >
            {isLoading ? (
                <RegisterDetailsPageSkeleton tabs={tabs} />
            ) : isNotFound ? (
                <div className="p-8 text-center text-red-500 bg-white rounded-lg border border-red-100 shadow-sm">
                    {t('recordNotFound')}
                </div>
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="col-span-12 lg:col-span-9">
                            <WidgetProvider
                                store={widgetStore}
                                schemaData={sectionDataMap}
                                translate={t}
                                apiAdapter={apiAdapter}
                            >
                                <SectionsContainer
                                    sections={orderedTabSections}
                                    onSectionSave={handleSectionSave}
                                />
                            </WidgetProvider>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                        {currentRegister && internalRecordId && (
                            <>
                                <ChangeRequestCard
                                    type={registerType}
                                    registerId={currentRegister.register_id}
                                    internalRecordId={internalRecordId}
                                    activeTabId={activeTabId}
                                    count={changeRequestCount}
                                    onCountLoaded={setChangeRequestCount}
                                />
                                <VersionHistoryCard
                                    type={registerType}
                                    registerId={currentRegister.register_id}
                                    internalRecordId={internalRecordId}
                                    activeTabId={activeTabId}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </RegisterTabsLayout>
    );
}
