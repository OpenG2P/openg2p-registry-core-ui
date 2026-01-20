'use client';

import { useParams } from 'next/navigation';
import {
    WidgetProvider,
    createWidgetStore,
    SectionsContainer,
} from '@openg2p/registry-widgets';
import { CapsuleDropdown, RegisterTabsLayout } from '@/components/shared';
import { VerificationCard } from '@/features/change-request/components';
import { useTranslations } from 'next-intl';
import { useRegisterTabs } from '@/context/RegisterTabsContext';
import { useBreadcrumb } from '@/shared/hooks';
import { useChangeRequest, useVerifications } from '@/features/change-request/hooks';
import { useRecordHistory } from '@/features/register/hooks/useRecordHistory';
import { useMemo, useState } from 'react';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterSectionsFromCR } from '@/features/change-request/components/useRegisterSectionsFromCR';
import { RegisterFlattenedRecord } from '@/features/register/types';

export default function VersionHistoryPage() {
    const t = useTranslations();
    const { type, id } = useParams<{ type: string; id: string }>();

    const { currentRegister } = useRegister();

    const [selectedChangeRequest, setSelectedChangeRequest] = useState<any | null>(null);

    const registerId = currentRegister?.register_id || "";

    const widgetStoreNew = useMemo(() => createWidgetStore(), []);


    const {
        tabs,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const {
        orderedTabSections,
    } = useRegisterSectionsFromCR({
        registerId,
        tabId: activeTabId,
        internalRecordId: id,
    });

    const {
        loadDates,
        loadChanges,
        selectedDate,
        loadingDates,
        loadingChanges,
    } = useRecordHistory();

    const [dateOptions, setDateOptions] = useState<string[]>([]);
    const [changeRequests, setChangeRequests] = useState<any[]>([]);


    const changeRequestId = selectedChangeRequest?.change_request_id;

    const { details, loading } = useChangeRequest(changeRequestId);
    const { verifications } = useVerifications(changeRequestId);

    const sectionId = details?.section_id;
    const sectionRegisterId = details?.section_register_id || "";
    const isListSection = details?.is_list || false;

    const innerSectionConfig = useMemo(() => {
        if (!orderedTabSections) return [];

        return orderedTabSections.filter(
            (section: any) =>
                section["section-id"] === sectionId
        );
    }, [orderedTabSections, sectionId]);


    const newSectionData = useMemo(() => {
        if (!details?.change_payload?.length) return undefined;

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        if (isListSection === true) {
            map[sectionRegisterId] = {
                records: details.change_payload
            };
            } else {
            map[sectionRegisterId] = details.change_payload[0];
        }


        return map;
    }, [details]);

    const openDateDropdown = async () => {
        const res = await loadDates({
            register_id: registerId,
            internal_record_id: id,
            tab_id: activeTabId || "",
        });

        setDateOptions(res?.dates ?? []);
    };

    const onDateSelect = async (date: string) => {
        setSelectedChangeRequest(null);
        const res = await loadChanges({
            register_id: registerId,
            internal_record_id: id,
            tab_id: activeTabId || "",
            truncated_created_date: date,
        });

        setChangeRequests(res?.changes ?? []);
    };

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


    const versionOptions = useMemo(
        () =>
            changeRequests.map((cr, index) => ({
                label: `V ${index + 1}`,
                value: cr,
            })),
        [changeRequests]
    );


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
                            items={dateOptions}
                            value={selectedDate ?? undefined}
                            onOpen={openDateDropdown}
                            onChange={onDateSelect}
                        />

                        <CapsuleDropdown
                            label="Select Version"
                            items={versionOptions.map(v => v.label)}
                            onChange={(label) => {
                                const selected = versionOptions.find(v => v.label === label);
                                setSelectedChangeRequest(selected?.value ?? null);
                            }}
                        />
                    </div>

                    <div className="bg-white rounded-[30px] p-6">
                        <WidgetProvider
                            store={widgetStoreNew}
                            schemaData={newSectionData}
                            translate={t}
                        >
                            {/* <SectionsContainer sections={innerSectionConfig} hideEditButton={true} mode='CRView'/> */}
                            <SectionsContainer sections={innerSectionConfig} hideEditButton={true} />

                        </WidgetProvider>
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
