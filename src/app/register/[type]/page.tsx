'use client';

import { useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/shared";
import { SelectedFilters } from "@/features/filter/components";
import { useRegistryFilters } from "@/features/filter/hooks/useRegistryFilters";
import { useFetch } from "@/shared/hooks/useFetch";
import { ResponseBody } from "@/shared/types";

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string | null;
}

interface RegisterRecord {
  internal_record_id: string;
  functional_record_id: string;
  record_name: string;
  image: string;
  display_fields: {
    field_name: string;
    value: string;
    order: number;
  }[];
}

export default function RegisterTypePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const {
    appliedFilters,
    filterConfig,
    applyFilters,
    removeFilter,
    clearAllFilters,
  } = useRegistryFilters();

  const type = params.type as string;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "7");

  /** fetch all registers */
  const { data: registersData } = useFetch<ResponseBody>({
    url: "/api/register/all",
    deps: [],
  });

  const registers = (registersData?.response_payload as Register[]) ?? [];

  const currentRegister = useMemo(
    () =>
      registers.find(
        (r) => r.register_mnemonic.toLowerCase() === type.toLowerCase()
      ),
    [registers, type]
  );

  const registerTypeLabel =
    currentRegister?.register_subject ?? "Register";

  /** fetch records for selected register */
  const {
    data: recordsData,
    loading,
  } = useFetch<ResponseBody>({
    url: currentRegister?.register_id
      ? `/api/register/${type}`
      : null,
    deps: [type, page, limit, search, currentRegister?.register_id],
    enabled: !!currentRegister?.register_id,
    options: {
      method: "POST",
      body: JSON.stringify({
        pagination_request: {
          current_page: page,
          page_size: limit,
          search_text: search,
        },
        request_payload: {
          register_id: currentRegister?.register_id,
        },
      }),
    },
  });

  const items = (recordsData?.response_payload as RegisterRecord[]) ?? [];
  const paginationResponse = recordsData?.pagination_response;

  const pagination = {
    page,
    limit,
    total: (paginationResponse?.number_of_pages || 1) * limit,
    pageStart: (page - 1) * limit + 1,
    pageEnd: (page - 1) * limit + items.length,
  };

  const handlePrev = () => {
    if (page <= 1) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page - 1));
    router.push(`/register/${type}?${params}`);
  };

  const handleNext = () => {
    if (
      !paginationResponse?.number_of_pages ||
      page >= paginationResponse.number_of_pages
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page + 1));
    router.push(`/register/${type}?${params}`);
  };

  return (
    <div className="min-h-screen mx-auto">
      <TopBar
        breadcrumb={[{ label: registerTypeLabel }]}
        showFilters
        showPagination
        pageStart={pagination.pageStart}
        pageEnd={pagination.pageEnd}
        total={pagination.total}
        onPrev={handlePrev}
        onNext={handleNext}
        onApplyFilters={applyFilters}
        appliedFilters={appliedFilters}
        filterConfig={filterConfig}
      />

      <div className="px-6 py-4">
        <div className="border-b border-gray-200 mb-4">
          <SelectedFilters
            appliedFilters={appliedFilters}
            filterConfig={filterConfig}
            removeFilter={removeFilter}
            clearAllFilters={clearAllFilters}
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
            items.map((item) => {
              const fields = [...(item.display_fields || [])].sort(
                (a, b) => a.order - b.order
              );

              return (
                <Link
                  key={item.internal_record_id}
                  href={`/register/${type}/${item.internal_record_id}`}
                  className="block"
                >
                  <div className="flex items-center gap-6 p-5 bg-white border-2 border-gray-300 rounded-md hover:shadow-sm hover:border-gray-400 transition-all">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.record_name}
                        className="w-16 h-16 rounded-md object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-md shrink-0"></div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-0.5">
                        {item.record_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold">ID :</span>{" "}
                        <span className="font-bold text-gray-900">
                          {item.internal_record_id}
                        </span>
                      </p>
                    </div>

                    {[0, 1, 2, 3, 4, 5].map(
                      (i) =>
                        fields[i] && (
                          <div key={i} className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">
                              <span className="font-bold text-gray-600">
                                {fields[i].field_name}:{" "}
                              </span>
                              <span className="font-bold">
                                {fields[i].value}
                              </span>
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
