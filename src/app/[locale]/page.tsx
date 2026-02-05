'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
    StatsCardLarge,
    StatsCardSmall,
    RegisterDropdown,
    SearchBar,
} from '@/components/ui';
import Image from 'next/image';

import { useRegister } from '@/context/RegisterContext';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';


type ActiveStatsCard =
    | 'registers'
    | 'change_request'
    | 'incoming_message'
    | 'outgoing_message';

const ALL_CARDS: ActiveStatsCard[] = [
    'registers',
    'change_request',
    'incoming_message',
    'outgoing_message',
];

const LIMITED_CARDS: ActiveStatsCard[] = [
    'registers',
    'change_request',
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


    const { registers, loading } = useRegister();

    const registerList =
        registers.map(r => ({
            value: r.register_mnemonic.toLowerCase(),
            label: t(r.register_subject),
        }));


    const searchPlaceholders: Record<ActiveStatsCard, string> = {
        registers: t('searchRegisters'),
        change_request: t('searchChangeRequests'),
        incoming_message: t('searchIncomingMessages'),
        outgoing_message: t('searchOutgoingMessages'),
    };

    const handleSearch = (value: string, register?: string) => {
        const searchValue = value.trim();

        if (activeStatsCard === 'registers') {
            const selected =
                register && register !== 'select'
                    ? register
                    : registerList[0]?.value;

            if (!selected) return;

            const params = new URLSearchParams();
            if (searchValue) {
                params.set('search', searchValue);
            }

            const query = params.toString();
            router.push(
                query
                    ? `/register/${selected}?${query}`
                    : `/register/${selected}`
            );
            return;
        }

        const routeMap: Record<
            Exclude<ActiveStatsCard, 'registers'>,
            string
        > = {
            change_request: '/change-request',
            incoming_message: '/incoming-messages',
            outgoing_message: '/outgoing-messages',
        };

        const params = new URLSearchParams();
        if (searchValue) {
            params.set('search', searchValue);
        }
        const query = params.toString();

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

    return (
        <div className="relative min-h-screen bg-[#EABB13] pt-8 sm:pt-10 md:pt-12 overflow-hidden text-gray-900">
            {/* background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg_pattern.png')] bg-repeat bg-size-[96px_96px] opacity-80 pointer-events-none" />

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

                    {/* Search Bar */}
                    <div className="relative border-[#ED7C22] flex h-14 w-4/5 items-center rounded-[10px] border bg-white overflow-visible">
                        {activeStatsCard === 'registers' && registerList && registerList.length > 0 && (
                            <RegisterDropdown
                                options={registerList}
                                selected={selectedRegister}
                                onChange={setSelectedRegister}
                            />
                        )}

                        <SearchBar
                            placeholder={searchPlaceholders[activeStatsCard]}
                            category={selectedRegister}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>
            </div>
            {/* People SVG aligned to bottom */}
            <div className="absolute bottom-0 w-full px-4">
                <Image
                    src="/svgs/People.svg"
                    alt={t('peoplesImageAlt')}
                    width={1200}
                    height={600}
                    // className="w-full h-auto select-none"
                    priority
                />
            </div>
        </div>
    );
}
