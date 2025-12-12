"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/shared";
import { SelectedFilters } from "@/components/shared/SelectedFilters";
import Link from "next/link";

interface RegistryItem {
  id: string;
  name: string;
  label1: string;
  label2: string;
}

export default function RegistryTypePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeFromPath = (params.type as string) || "individual";
  const type = typeFromPath || "individual";
  const search = searchParams.get("q") || searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    total: 7,
    pageStart: 1,
    pageEnd: 7,
  });
  const defaultFilters = ["default filter"];
  const [activeFilters, setActiveFilters] = useState<string[]>(defaultFilters);

  const typeLabels: Record<string, string> = {
    individual: "Individuals",
    individuals: "Individuals",
    family: "Families",
    families: "Families",
    crops: "Crops",
    lands: "Lands",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "5",
        });
        if (search) {
          params.set("search", search);
        }

        const response = await fetch(`/api/registry/${type}?${params.toString()}`);
        const data = await response.json();

        setItems(data.items || []);
        setPagination(data.pagination || pagination);
      } catch (error) {
        console.error("Error fetching registry data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, page, search]);

  useEffect(() => {
    if (search) {
      setActiveFilters([...defaultFilters, `Search: ${search}`]);
    } else {
      setActiveFilters(defaultFilters);
    }
  }, [search]);

  const handlePrev = () => {
    if (pagination.page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (pagination.page - 1).toString());
      router.push(`/registry/${type}?${params.toString()}`);
    }
  };

  const handleNext = () => {
    if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (pagination.page + 1).toString());
      router.push(`/registry/${type}?${params.toString()}`);
    }
  };

  const handleClearFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("search");
      params.set("page", "1");
      router.push(`/registry/${type}?${params.toString()}`);
      return;
    }
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("search");
    params.set("page", "1");
    router.push(`/registry/${type}?${params.toString()}`);
    setActiveFilters(defaultFilters);
  };

  const handleNewFilter = (filter: string) => {
    setActiveFilters([...activeFilters, filter]);
  };

  const breadcrumb = [
    { label: typeLabels[type] || "Registry", href: undefined },
  ];

  return (
    <div className="min-h-scree mx-auto">
      <TopBar
        breadcrumb={breadcrumb}
        showFilters={true}
        showPagination={true}
        pageStart={pagination.pageStart}
        pageEnd={pagination.pageEnd}
        total={pagination.total}
        onPrev={handlePrev}
        onNext={handleNext}
        onFilters={handleNewFilter}
      />

      <div className="px-6 py-4">
        <div className="border-b border-gray-200 mb-4">
          <SelectedFilters
            filters={activeFilters}
            onClearFilter={handleClearFilter}
            onClearAll={handleClearAll}
          />
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No items found
            </div>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={`/registry/${type}/${item.id}`}
                className="block"
              >
                <div className="flex items-center gap-6 p-5 bg-white border-2 border-gray-300 rounded-md hover:shadow-sm hover:border-gray-400 transition-all">
                  <div className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0"></div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base mb-0.5">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">ID :</span>{" "}
                      <span className="font-bold text-gray-900">{item.id}</span>
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-0.5">
                      <span className="font-bold text-gray-600">Label 1: </span>
                      <span className="font-bold">{item.label1}</span>
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-bold text-gray-600">Label 2: </span>
                      <span className="font-bold">{item.label2}</span>
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-0.5">
                      <span className="font-bold text-gray-600">Label 1: </span>
                      <span className="font-bold">{item.label1}</span>
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-bold text-gray-600">Label 2: </span>
                      <span className="font-bold">{item.label2}</span>
                    </p>
                  </div>

                   <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-0.5">
                      <span className="font-bold text-gray-600">Label 1: </span>
                      <span className="font-bold">{item.label1}</span>
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-bold text-gray-600">Label 2: </span>
                      <span className="font-bold">{item.label2}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
