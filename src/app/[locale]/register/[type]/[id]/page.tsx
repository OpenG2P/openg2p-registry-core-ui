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

import { useRegisterDetail } from '@/features/register/hooks/useRegisterDetail';


export default function RegisterDetailPage() {
    const t = useTranslations();
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
    } = useRegisterDetail();


    // Helper to render skeleton placeholders
    const renderSkeleton = () => (
        <div className="grid grid-cols-12 gap-6 animate-pulse">
            <div className="col-span-12 lg:col-span-9 space-y-6">
                <div className="bg-gray-300 rounded-lg w-full h-[300px]" />
                <div className="bg-gray-300 rounded-lg w-full h-[300px]" />
            </div>

            <div className="hidden lg:block lg:col-span-3 space-y-6">
                <div className="bg-gray-300 rounded-lg h-48 w-full" />
                <div className="bg-gray-300 rounded-lg h-48 w-full" />
            </div>
        </div>
    );

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
                renderSkeleton()
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
