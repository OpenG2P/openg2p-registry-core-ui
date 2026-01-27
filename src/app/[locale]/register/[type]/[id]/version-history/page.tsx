'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
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

type Change = {
    change_request_id: string;
    created_at: string;
};

type SectionWithChanges = {
    section_mnemonic: string;
    changes: Change[];
};

export default function VersionHistoryPage() {
    const t = useTranslations();

    const { type: registerType, id: internalRecordId } =
        useParams<{ type: string; id: string }>();

    const { currentRegister } = useRegister();
    const { functionalRecordId, recordName } = useRegisterRecord();

    const registerId = currentRegister?.register_id ?? '';

    const widgetStore = useMemo(() => createWidgetStore(), []);

    const [dateOptions, setDateOptions] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

    const [sectionsWithChanges, setSectionsWithChanges] = useState<
        Record<string, SectionWithChanges>
    >({});

    const {
        tabs,
        activeTabIndex,
        activeTabId,
        setActiveTabByIndex,
    } = useRegisterTabs();

    const { orderedTabSections } = useRegisterSectionsFromCR({
        registerId,
        tabId: activeTabId,
        internalRecordId,
    });

    const {
        datesData,
        changesData,
        loadingChanges,
    } = useRecordHistory({
        register_id: registerId,
        internal_record_id: internalRecordId || '',
        tab_id: activeTabId,
        truncated_created_date: selectedDate,
    });

    // Here selectedVersionId is the change request id 
    const changeRequestId = selectedVersionId ?? '';
    const { details: changeRequestData, loading: loadingChangeRequestData } =
        useChangeRequest(changeRequestId);

    const { verifications } = useVerifications(changeRequestId);

    /* ───────── Handle dates response ───────── */
    useEffect(() => {
        if (datesData?.dates?.length) {
            setDateOptions(datesData.dates);
            setSelectedDate(prev => prev || datesData.dates[0]);
        } else if (datesData) {
            setDateOptions([]);
            setSelectedDate(null);
            setSectionsWithChanges({});
        }
    }, [datesData]);

    /* ───────── Handle changes response ───────── */
    useEffect(() => {
        if (!changesData) return;

        const changesArray = Array.isArray(changesData) ? changesData : (changesData?.changes ?? []);
        const dict: Record<string, SectionWithChanges> = {};

        changesArray.forEach((item: any) => {
            dict[item.section_id] = {
                section_mnemonic: item.section_mnemonic,
                changes: item.changes ?? [],
            };
        });

        setSectionsWithChanges(dict);

        // Auto-select first section and its first version
        const sectionIds = Object.keys(dict);
        if (sectionIds.length > 0) {
            const firstSecId = sectionIds[0];
            setSelectedSectionId(firstSecId);
            const firstSec = dict[firstSecId];
            if (firstSec.changes.length > 0) {
                setSelectedVersionId(firstSec.changes[0].change_request_id);
            }
        } else {
            setSelectedSectionId(null);
            setSelectedVersionId(null);
        }
    }, [changesData]);

    const sectionOptions = useMemo(() => {
        return Object.entries(sectionsWithChanges).map(([id, data]) => ({
            id,
            label: t.has(data.section_mnemonic)
                ? t(data.section_mnemonic)
                : data.section_mnemonic,
        }));
    }, [sectionsWithChanges, t]);

    const versionOptions = useMemo(() => {
        if (!selectedSectionId) return [];
        return (
            sectionsWithChanges[selectedSectionId]?.changes.map((cr, index) => ({
                label: `V${index + 1}`,
                value: cr.change_request_id,
            })) ?? []
        );
    }, [selectedSectionId, sectionsWithChanges]);


    const onDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSectionId(null);
        setSelectedVersionId(null);
    };

    const onSectionSelect = (label: string) => {
        const selected = sectionOptions.find(section => section.label === label);
        if (!selected) return;

        setSelectedSectionId(selected.id);
        setSelectedVersionId(
            sectionsWithChanges[selected.id]?.changes?.[0]?.change_request_id ?? null
        );
    };

    const onVersionSelect = (label: string) => {
        const option = versionOptions.find(version => version.label === label);
        if (option) {
            setSelectedVersionId(option.value);
        }
    };

    const handleTabChange = (index: number) => {
        setActiveTabByIndex(index);
        setDateOptions([]);
        setSelectedDate(null);
        setSectionsWithChanges({});
    };

    const innerSectionConfig = useMemo(() => {
        if (!orderedTabSections || !changeRequestData?.section_id) return [];
        return orderedTabSections.filter(
            (section: any) =>
                section['section-id'] === changeRequestData.section_id
        );
    }, [orderedTabSections, changeRequestData?.section_id]);

    const newSectionData = useMemo(() => {
        if (!changeRequestData?.change_payload?.length) return undefined;

        const map: Record<
            string,
            RegisterFlattenedRecord | { records: RegisterFlattenedRecord[] }
        > = {};

        if (changeRequestData.is_list) {
            map[changeRequestData.section_register_id] = {
                records: changeRequestData.change_payload,
            };
        } else {
            map[changeRequestData.section_register_id] =
                changeRequestData.change_payload[0];
        }

        return map;
    }, [changeRequestData]);

    const breadcrumb = useBreadcrumb({
        registerType,
        functionalRecordId,
        recordName,
        internalRecordId,
        includeActiveTab: true,
        includeChangeRequest: false,
        customItems: [
            { label: t('versionHistory') ?? 'Version History', href: '#' },
        ],
    });

    const showSkeleton = loadingChangeRequestData || loadingChanges;

    return (
        <RegisterTabsLayout
            breadcrumb={breadcrumb}
            tabs={{ tabs }}
            activeTab={activeTabIndex}
            onTabChange={handleTabChange}
        >
            {showSkeleton ? (
                <VersionHistoryPageSkeleton tabs={tabs} />
            ) : (
                <div className="flex gap-6">
                    <div className="w-[75%] flex flex-col gap-6">
                        <div className="bg-white rounded-[30px] px-6 py-5 flex items-center gap-6">
                            <CapsuleDropdown
                                label="Select Date"
                                items={dateOptions}
                                value={selectedDate ?? undefined}
                                onChange={onDateSelect}
                            />

                            <CapsuleDropdown
                                label="Select Section"
                                items={sectionOptions.map(s => s.label)}
                                value={
                                    selectedSectionId
                                        ? sectionOptions.find(s => s.id === selectedSectionId)?.label
                                        : undefined
                                }
                                onChange={onSectionSelect}
                                key={selectedDate ?? 'date'}
                            />

                            <CapsuleDropdown
                                label="Select Version"
                                items={versionOptions.map(v => v.label)}
                                value={versionOptions.find(v => v.value === selectedVersionId)?.label}
                                onChange={onVersionSelect}
                                key={`${selectedDate}-${selectedSectionId}`}
                            />
                        </div>

                        <div className="bg-white rounded-[30px]">
                            <WidgetProvider
                                store={widgetStore}
                                schemaData={newSectionData}
                                translate={t}
                            >
                                <SectionsContainer
                                    sections={innerSectionConfig}
                                    hideEditButton
                                />
                            </WidgetProvider>
                        </div>
                    </div>

                    <div className="w-[25%] space-y-3">
                        {verifications.length > 0 ? (
                            verifications.map(v => (
                                <VerificationCard
                                    key={v.verification_id}
                                    verification={v}
                                />
                            ))
                        ) : (
                            <div className="bg-[#E0E0E0] rounded-[25px] p-6 space-y-3">
                                <div className="font-semibold text-[14px] text-black/50">
                                    Verified by
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 relative">
                                        <Image
                                            src="/verified_person.png"
                                            alt="verified person"
                                            fill
                                            className="rounded-full object-cover opacity-20 grayscale"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[20px] font-medium text-black/20">
                                            —
                                        </span>
                                        <span className="text-[14px] text-black/20">
                                            —
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[14px] font-medium text-black/50 mb-1">
                                        Message
                                    </div>
                                    <div className="text-[16px] text-black/50">
                                        No verifier assigned for this change request version.
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </RegisterTabsLayout>
    );
}
