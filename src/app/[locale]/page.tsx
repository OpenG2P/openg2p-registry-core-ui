'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
    StatsCardLarge,
    StatsCardSmall,
    SearchBarDropdown,
    SearchBar,
} from '@/components/ui';
import Image from 'next/image';

import { useRegister } from '@/context/RegisterContext';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';

import { REGISTER_ACTIONS } from '@/features/register/utils/register.actions';
import { INTAKE_FORM_ACTIONS } from '@/features/intake-form/utils/intakeForm.actions';
import { CHANGE_REQUEST_ACTIONS } from '@/features/change-request/utils/changeRequest.actions';
import { INCOMING_MESSAGE_ACTIONS } from '@/features/messages/utils/incomingMessage.actions';
import { OUTGOING_MESSAGE_ACTIONS } from '@/features/messages/utils/outgoingMessage.actions';
import Can from '@/components/shared/Can';


type ActiveStatsCard =
    | 'registers'
    | 'intake-form'
    | 'change-request'
    | 'messages';

const ALL_CARDS: ActiveStatsCard[] = [
    'registers',
    'intake-form',
    'change-request',
    'messages'
];

const LIMITED_CARDS: ActiveStatsCard[] = [
    'registers',
    'change-request',
];

export default function Home() {
    const router = useRouter();
    const t = useTranslations();
    const { config } = useRuntimeConfig();

    const statsCardVariant = config?.partnerImportExportEnable ? 'small' : 'large';
    const visibleCards = statsCardVariant === 'small' ? ALL_CARDS : LIMITED_CARDS;

    const [activeStatsCard, setActiveStatsCard] =
        useState<ActiveStatsCard>('registers');
    const [selectedRegister, setSelectedRegister] = useState('select');
    const [selectedMessageType, setSelectedMessageType] = useState('incoming');

    const messageTypeOptions = [
        { value: 'incoming', label: t('incoming_messages') },
        { value: 'outgoing', label: t('outgoing_messages') },
    ];


    const { registers } = useRegister();

    const registerList =
        registers.map(r => ({
            value: r.register_mnemonic.toLowerCase(),
            label: t(r.register_subject),
        }));


    const searchPlaceholders: Record<ActiveStatsCard, string> = {
        'registers': t('search_registers'),
        'intake-form': t('search_intake_form'),
        'change-request': t('search_change_requests'),
        'messages': t('search_messages')
    };

    const handleSearch = (value: string, register?: string) => {
        const searchValue = value.trim();

        const params = new URLSearchParams();
        if (searchValue) {
            params.set('search', searchValue);
        }
        params.set('page', '1');

        const query = params.toString();

        if (activeStatsCard === 'registers' || activeStatsCard === 'intake-form') {
            const selected =
                register && register !== 'select'
                    ? register
                    : registerList[0]?.value;

            if (!selected) return;

            const basePath =
                activeStatsCard === 'registers'
                    ? `/register/${selected}`
                    : `/intake-form/${selected}`;

            router.push(query ? `${basePath}?${query}` : basePath);
            return;
        }

        if (activeStatsCard === 'messages') {
            const type = selectedMessageType || 'incoming';

            const basePath =
                type === 'incoming'
                    ? '/incoming-messages'
                    : '/outgoing-messages';

            router.push(query ? `${basePath}?${query}` : basePath);
            return;
        }

        const routeMap: Record<
            Exclude<ActiveStatsCard, 'registers' | 'intake-form' | 'messages'>,
            string
        > = {
            'change-request': '/change-request'
        };
        router.push(
            query
                ? `${routeMap[activeStatsCard]}?${query}`
                : routeMap[activeStatsCard]
        );
    };

    const StatsCardComponent =
        statsCardVariant === 'small'
            ? StatsCardSmall
            : StatsCardLarge;


    const getViewAction = (
        activeStatsCard: ActiveStatsCard,
        selectedMessageType: string
    ) => {
        switch (activeStatsCard) {
            case "registers":
                return REGISTER_ACTIONS.view;
            case "intake-form":
                return INTAKE_FORM_ACTIONS.view;
            case "change-request":
                return CHANGE_REQUEST_ACTIONS.view;
            case "messages":
                return selectedMessageType === "incoming"
                    ? INCOMING_MESSAGE_ACTIONS.view
                    : OUTGOING_MESSAGE_ACTIONS.view;
        }
    };

    const viewAction = getViewAction(activeStatsCard, selectedMessageType);

    return (
        <div className="min-h-screen bg-[#EABB13] pt-8 sm:pt-10 md:pt-12 overflow-hidden text-gray-900 bg-[url('/images/common/bg_pattern.png')]">
            <div className="relative">
                <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 py-8 sm:py-10 lg:py-12 space-y-10 sm:space-y-12 lg:space-y-14">

                    {/* stats cards */}
                    <div className={`flex flex-wrap items-stretch gap-4 sm:gap-5 lg:gap-6 ${statsCardVariant === 'small' ? 'w-full justify-center' : 'w-4/5 justify-between'}`}>
                        {visibleCards.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setActiveStatsCard(type)}
                                className={`bg-transparent p-0 text-left ${statsCardVariant === 'small' ? 'flex-1 min-w-40 sm:min-w-45 lg:min-w-55' : 'w-[calc(50%-12px)] sm:w-[calc(50%-10px)] lg:w-[calc(50%-12px)]'}`}
                            >
                                <StatsCardComponent
                                    stats_endpoint={`/api/stats/${type === 'registers' ? 'register' : type}`}
                                    active={activeStatsCard === type}
                                />
                            </button>
                        ))}
                    </div>
                    <Can
                        action={viewAction}
                        fallback={
                            <div className="relative border border-[#ED7C22] flex h-14 w-4/5 items-center rounded-[10px] bg-white overflow-visible">
                                <div className="relative flex items-center w-full h-full">
                                    <SearchBar
                                        placeholder={searchPlaceholders[activeStatsCard]}
                                        category={selectedRegister}
                                        onSearch={() => { }}
                                    />
                                    <div className="absolute inset-0 z-10 cursor-not-allowed" />
                                </div>
                            </div>
                        }
                    >
                        <div className="relative border border-[#ED7C22] flex h-14 w-4/5 items-center rounded-[10px] bg-white overflow-visible">

                            {(activeStatsCard === 'registers' || activeStatsCard === 'intake-form') &&
                                registerList?.length > 0 && (
                                    <SearchBarDropdown
                                        options={registerList}
                                        selected={selectedRegister}
                                        onChange={setSelectedRegister}
                                    />
                                )}

                            {activeStatsCard === 'messages' && (
                                <SearchBarDropdown
                                    options={messageTypeOptions}
                                    selected={selectedMessageType}
                                    onChange={setSelectedMessageType}
                                />
                            )}

                            <SearchBar
                                placeholder={searchPlaceholders[activeStatsCard]}
                                category={selectedRegister}
                                onSearch={handleSearch}
                            />
                        </div>
                    </Can>
                </div>
                <div className="bottom-0 w-full px-4">
                    <Image
                        src="/images/common/people.svg"
                        alt={t('peoples_image_alt')}
                        width={1200}
                        height={600}
                        className="w-full h-auto select-none"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}