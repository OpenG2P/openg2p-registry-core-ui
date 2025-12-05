"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCard,RegistryDropdown,SearchBar } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState("registers");

  const placeholders: Record<string, string> = {
    registers: "Search Registers",
    change: "Search Change Requests",
    incoming: "Search Incoming Messages",
    outgoing: "Search Outgoing Messages",
  };

  const dropdownOptions = [
    { value: "families", label: "Families" },
    { value: "individuals", label: "Individuals" },
    { value: "crops", label: "Crops" },
    { value: "lands", label: "Lands" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("select");

  const handleSearch = (value: string, category?: string) => {
    if (!value.trim()) return;

    let route = "";

    if (active === "registers") {
      const registryRoutes: Record<string, string> = {
        families: "/family",
        individuals: "/individual",
        crops: "/crop",
        lands: "/land",
      };

      route = registryRoutes[category || selectedCategory] || "/family";
    } else if (active === "change") {
      route = "/change_request";
    } else if (active === "incoming") {
      route = "/incoming_message";
    } else if (active === "outgoing") {
      route = "/outgoing_message";
    }

    router.push(`${route}?q=${encodeURIComponent(value)}`);
    
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-14 space-y-14">
        <div className="flex w-full max-w-5xl flex-wrap items-stretch justify-between gap-6">
          <div className="flex-1 min-w-[180px] cursor-pointer" onClick={() => setActive("registers")}>
            <StatsCard api_endpoint="/api/stats/registers" active={active === "registers"} />
          </div>
          <div className="flex-1 min-w-[180px] cursor-pointer" onClick={() => setActive("change")}>
            <StatsCard api_endpoint="/api/stats/change_requests" active={active === "change"} />
          </div>
          <div className="flex-1 min-w-[180px] cursor-pointer" onClick={() => setActive("incoming")}>
            <StatsCard api_endpoint="/api/stats/incoming" active={active === "incoming"} />
          </div>
          <div className="flex-1 min-w-[180px] cursor-pointer" onClick={() => setActive("outgoing")}>
            <StatsCard api_endpoint="/api/stats/outgoing" active={active === "outgoing"} />
          </div>
        </div>

        <div className=" flex w-full h-14 items-center max-w-5xl border border-gray-300 bg-white rounded-xl">
         
            {active === "registers" && (
              <RegistryDropdown
                options={dropdownOptions}
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
            )}

            <SearchBar
              placeholder={placeholders[active]}
              category={selectedCategory}
              onSearch={handleSearch}
            />

         
        </div>

      </div>

      <div className="fixed bottom-8 left-0 right-0 text-center text-sm text-gray-500">
        <p className="text-xl text-gray-600">powered by</p>
        <p className="text-2xl font-bold text-gray-800 ">OpenG2P Registry</p>
      </div>
    </div>
  );
}
