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


type ActiveStatsCard =
    | 'registers'
    | 'change_request'
    | 'incoming_message'
    | 'outgoing_message';

const isPartnerImportExportEnabled = true
    // process.env.NEXT_PUBLIC_PARTNER_IMPORT_EXPORT_ENABLE === 'true';

const statsCardVariant = isPartnerImportExportEnabled ? 'small' : 'large';

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

const visibleCards =
    statsCardVariant === 'small' ? ALL_CARDS : LIMITED_CARDS;

export default function Home() {
    const router = useRouter();
    const t = useTranslations();

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
        <div className="relative min-h-screen bg-[#EABB13] pt-10 sm:pt-14 md:pt-16 lg:pt-1 overflow-hidden text-gray-900">
            {/* background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg_pattern.png')] bg-repeat bg-size-[96px_96px] opacity-80 pointer-events-none" />

            <div className="relative">
                <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 py-10 sm:py-12 lg:py-14 space-y-10 sm:space-y-12 lg:space-y-14">

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
                    <div className="relative border-[#ED7C22] flex h-14 w-4/5 items-center rounded-[30px] border bg-white overflow-visible">
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

                {/* People SVG below search bar  */}
                <div className="relative w-full mt-8 sm:mt-10 md:mt-12 lg:mt-14 px-4 sm:px-6 md:px-8 lg:px-10">
                    <Image
                        src="/svgs/People.svg"
                        alt={t('peoplesImageAlt')}
                        width={1200}
                        height={600}
                        className="w-full h-auto opacity-100 pointer-events-none select-none"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
