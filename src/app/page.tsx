"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatsCard, RegisterDropdown, SearchBar } from "@/components/ui";
import { useFetch } from "@/shared/hooks/useFetch";

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string;
}

type ActiveStatsCard = "registers" | "change" | "incoming" | "outgoing";

export default function Home() {
  const router = useRouter();

  const [activeStatsCard, setActiveStatsCard] =
    useState<ActiveStatsCard>("registers");
  const [selectedRegister, setSelectedRegister] = useState("select");

  const { data, execute } = useFetch<Register[]>();
  useEffect(() => {
    execute("/api/register/all");
  }, [execute]);


  const searchPlaceholders: Record<ActiveStatsCard, string> = {
    registers: "Search Registers",
    change: "Search Change Requests",
    incoming: "Search Incoming Messages",
    outgoing: "Search Outgoing Messages",
  };

  const registerList =
    data?.map((register) => ({
      value: register.register_mnemonic.toLowerCase(),
      label: register.register_subject,
    })) ?? [];


  const handleSearch = (value: string, register?: string) => {
    const searchValue = value.trim();

    if (!searchValue && activeStatsCard !== "registers") return;

    if (activeStatsCard === "registers") {
      const selected =
        register && register !== "select"
          ? register
          : registerList[0]?.value; //for now default register will first element of array

      const params = new URLSearchParams();
      if (searchValue) {
        params.set("search", searchValue);
      }

      router.push(`/register/${selected}?${params.toString()}`);
      return;
    }

    const routeMap: Record<
      Exclude<ActiveStatsCard, "registers">,
      string
    > = {
      change: "/change_request",
      incoming: "/incoming_message",
      outgoing: "/outgoing_message",
    };

    router.push(
      `${routeMap[activeStatsCard]}?q=${encodeURIComponent(searchValue)}`
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-14 space-y-14">
        <div className="flex w-full max-w-5xl flex-wrap items-stretch justify-between gap-6">
          <div
            className="flex-1 min-w-[180px] cursor-pointer"
            onClick={() => setActiveStatsCard("registers")}
          >
            <StatsCard
              stats_endpoint="/api/stats/register"
              active={activeStatsCard === "registers"}
            />
          </div>

          <div
            className="flex-1 min-w-[180px] cursor-pointer"
            onClick={() => setActiveStatsCard("change")}
          >
            <StatsCard
              stats_endpoint="/api/stats/change_request"
              active={activeStatsCard === "change"}
            />
          </div>

          <div
            className="flex-1 min-w-[180px] cursor-pointer"
            onClick={() => setActiveStatsCard("incoming")}
          >
            <StatsCard
              stats_endpoint="/api/stats/incoming_message"
              active={activeStatsCard === "incoming"}
            />
          </div>

          <div
            className="flex-1 min-w-[180px] cursor-pointer"
            onClick={() => setActiveStatsCard("outgoing")}
          >
            <StatsCard
              stats_endpoint="/api/stats/outgoing_message"
              active={activeStatsCard === "outgoing"}
            />
          </div>
        </div>

        <div className="flex h-14 w-full max-w-5xl items-center rounded-xl border border-gray-300 bg-white">
          {activeStatsCard === "registers" && (
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

      <div className="bottom-8 left-0 right-0 p-10 text-center text-sm text-gray-500">
        <p className="text-xl text-gray-600">powered by</p>
        <p className="text-2xl font-bold text-gray-800">
          OpenG2P Registry
        </p>
      </div>
    </div>
  );
}
