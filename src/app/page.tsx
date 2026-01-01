'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  StatsCardLarge,
  StatsCardSmall,
  RegisterDropdown,
  SearchBar,
} from '@/components/ui';
import { useFetch } from '@/shared/hooks/useFetch';
import Image from 'next/image';

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string | null;
}

type ActiveStatsCard =
  | 'registers'
  | 'change_request'
  | 'incoming_message'
  | 'outgoing_message';

const isPartnerImportExportEnabled =
  process.env.NEXT_PUBLIC_PARTNER_IMPORT_EXPORT_ENABLE === 'true';

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

  const [activeStatsCard, setActiveStatsCard] =
    useState<ActiveStatsCard>('registers');
  const [selectedRegister, setSelectedRegister] = useState('select');

  const { data: registers, loading: registerLoading } = useFetch<Register[]>({
    url: '/api/register/all',
  });

  const searchPlaceholders: Record<ActiveStatsCard, string> = {
    registers: 'Search Registers',
    change_request: 'Search Change Requests',
    incoming_message: 'Search Incoming Messages',
    outgoing_message: 'Search Outgoing Messages',
  };

  const registerList =
    registers?.map((register) => ({
      value: register.register_mnemonic.toLowerCase(),
      label: register.register_subject,
    })) ?? [];

  const handleSearch = (value: string, register?: string) => {
    const searchValue = value.trim();

    if (!searchValue && activeStatsCard !== 'registers') return;

    if (activeStatsCard === 'registers') {
      const selected =
        register && register !== 'select'
          ? register
          : registerList[0]?.value;

      if (!selected) return;

      const params = new URLSearchParams();
      if (searchValue) params.set('search', searchValue);

      router.push(`/register/${selected}?${params.toString()}`);
      return;
    }

    const routeMap: Record<
      Exclude<ActiveStatsCard, 'registers'>,
      string
    > = {
      change_request: '/change-request',
      incoming_message: '/incoming_message',
      outgoing_message: '/outgoing_message',
    };

    router.push(
      `${routeMap[activeStatsCard]}?q=${encodeURIComponent(searchValue)}`
    );
  };

  const StatsCardComponent =
    statsCardVariant === 'small'
      ? StatsCardSmall
      : StatsCardLarge;

  return (
    <div
      className="
        relative min-h-screen bg-[#EABB13]
        pt-10 sm:pt-14 md:pt-16 lg:pt-16
        overflow-hidden text-gray-900
     "
    >
      {/* background vector svg */}
      <div
        className="
          absolute inset-0
          bg-[url('/svgs/VectorGroup.svg')]
          bg-repeat
          bg-size-[240px_240px]
          sm:bg-size-[300px_300px]
          md:bg-size-[420px_420px]
          lg:bg-size-[492.5px_492.55px]
          opacity-40
        "
      />

      <div className="relative">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 py-10 sm:py-12 lg:py-14 space-y-10 sm:space-y-12 lg:space-y-14">

          {/* stats cards */}
          <div
            className={`
              flex flex-wrap items-stretch
              gap-4 sm:gap-5 lg:gap-6
              ${statsCardVariant === 'small'
                ? 'w-full justify-center'
                : 'w-4/5 justify-between'
              }
            `}
          >
            {visibleCards.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveStatsCard(type)}
                className={`
                  bg-transparent p-0 text-left
                  ${statsCardVariant === 'small'
                    ? 'flex-1 min-w-40 sm:min-w-[180px] lg:min-w-[220px]'
                    : 'w-[calc(50%-12px)] sm:w-[calc(50%-10px)] lg:w-[calc(50%-12px)]'
                  }
                `}
              >
                <StatsCardComponent
                  stats_endpoint={`/api/stats/${type === 'registers' ? 'register' : type
                    }`}
                  active={activeStatsCard === type}
                />
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div
            className="relative border-[#ED7C22] flex h-14 w-4/5 items-center rounded-[30px] border bg-white overflow-visible"
          >
            {activeStatsCard === 'registers' && (
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
            alt="Peoples"
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
