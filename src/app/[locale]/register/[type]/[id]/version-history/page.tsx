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
import { useEffect, useMemo, useState } from 'react';
import { useRegister } from '@/context/RegisterContext';
import { useRegisterSectionsFromCR } from '@/features/change-request/hooks/useRegisterSectionsFromCR';
import { useRegisterRecord } from '@/context/RegisterRecordContext';
import { RegisterFlattenedRecord } from '@/features/register/types';
import VersionHistoryPageSkeleton from '@/features/register/components/VersionHistoryPageSkeleton';

export default function VersionHistoryPage() {
    const t = useTranslations();
    const { type: registerType, id: internalRecordId } = useParams<{ type: string; id: string }>();

    const { currentRegister } = useRegister();

    const { functionalRecordId, recordName } = useRegisterRecord();

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
        internalRecordId,
    });

    const {
        loadDates,
        loadChanges,
        selectedDate,
        setSelectedDate,
        selectedVersion,
        setSelectedVersion,
        loadingDates,
        loadingChanges,
    } = useRecordHistory();

    const [dateOptions, setDateOptions] = useState<string[]>([]);
    const [changeRequests, setChangeRequests] = useState<any[]>([]);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

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

    const getVersionLabel = (cr: any) => {
        const sectionLabel = t.has(cr.section_mnemonic)
            ? t(cr.section_mnemonic)
            : cr.section_mnemonic.replace(/_/g, ' ');

        const formattedDate = new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(cr.created_at));

        return `${sectionLabel} - ${formattedDate}`;
    };

    useEffect(() => {
        const initializeData = async () => {
            if (!registerId || !internalRecordId || !activeTabId || initialLoadDone) return;

            const res = await loadDates({
                register_id: registerId,
                internal_record_id: internalRecordId,
                tab_id: activeTabId,
            });

            if (res?.dates?.length > 0) {
                setDateOptions(res.dates);
                // Select first date
                const firstDate = res.dates[0];
                const changesRes = await loadChanges({
                    register_id: registerId,
                    internal_record_id: internalRecordId,
                    tab_id: activeTabId,
                    truncated_created_date: firstDate,
                });

                if (changesRes?.changes?.length > 0) {
                    const firstCR = changesRes.changes[0];

                    setChangeRequests(changesRes.changes);
                    setSelectedChangeRequest(firstCR);
                    setSelectedVersion(getVersionLabel(firstCR));
                }
            } else {
                setDateOptions([]);
            }

            setInitialLoadDone(true);
        };

        initializeData();
    }, [registerId, internalRecordId, activeTabId]);


    const openDateDropdown = async () => {
        const res = await loadDates({
            register_id: registerId,
            internal_record_id: internalRecordId,
            tab_id: activeTabId || "",
        });

        setDateOptions(res?.dates ?? []);
    };

    const onDateSelect = async (date: string) => {
        setSelectedChangeRequest(null);
        setSelectedVersion(null);
        setChangeRequests([]);

        const res = await loadChanges({
            register_id: registerId,
            internal_record_id: internalRecordId,
            tab_id: activeTabId || '',
            truncated_created_date: date,
        });

        if (res?.changes?.length) {
            const firstCR = res.changes[0];
            setChangeRequests(res.changes);
            setSelectedChangeRequest(firstCR);
            setSelectedVersion(getVersionLabel(firstCR));
        }
    };

    const breadcrumb = useBreadcrumb({
        registerType,
        functionalRecordId,
        recordName,
        internalRecordId,
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
            changeRequests.map((cr) => ({
                label: getVersionLabel(cr),
                value: cr,
            })),
        [changeRequests]
    );

    const handleTabChange = (index: number) => {
        setActiveTabByIndex(index);

        setInitialLoadDone(false);
        setDateOptions([]);
        setChangeRequests([]);
        setSelectedChangeRequest(null);
        setSelectedVersion(null)
        setSelectedDate(null);
    };


    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumb}
            tabs={{ tabs }}
            activeTab={activeTabIndex}
            onTabChange={handleTabChange}
        >
            {loading ? (
                <VersionHistoryPageSkeleton tabs={tabs} />
            ) : (
                <div className="flex gap-6">
                    <div className="w-[75%] flex flex-col gap-6">
                        <div className="bg-white rounded-[30px] px-6 py-5 flex items-center gap-6">
                            <CapsuleDropdown
                                label="Select Date"
                                items={dateOptions}
                                value={selectedDate ?? undefined}
                                onOpen={openDateDropdown}
                                onChange={onDateSelect}
                                emptyMessage="No version history available"
                            />

                            <CapsuleDropdown
                                label="Select Version"
                                items={versionOptions.map(v => v.label)}
                                value={selectedVersion ?? undefined}
                                onChange={(label) => {
                                    const selected = versionOptions.find(v => v.label === label);
                                    setSelectedChangeRequest(selected?.value ?? null);
                                    setSelectedVersion(label);
                                }}
                                emptyMessage="No versions available"
                                key={selectedDate}
                            />
                        </div>

                        <div className="bg-white rounded-[30px]">
                            <WidgetProvider
                                store={widgetStoreNew}
                                schemaData={newSectionData}
                                translate={t}
                            >
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
            )}
        </RegisterTabsLayout>
    );
}
