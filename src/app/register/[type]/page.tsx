"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/shared";
import { SelectedFilters } from "@/features/filter/components";
import { useRegistryFilters } from "@/features/filter/hooks/useRegistryFilters";
import { useFetch } from "@/shared/hooks/useFetch";

import { PaginationResponse } from '@/shared/types';

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string;
}

interface RegisterItem {
  id: string;
  name: string;
  label1: string;
  label2: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationResponse;
}

export default function RegisterTypePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { appliedFilters, filterConfig, applyFilters, removeFilter, clearAllFilters, } = useRegistryFilters();

  const { data: registersData, execute: executeRegisters } = useFetch<Register[]>();
  const { data, loading, error, execute } = useFetch<PaginatedResponse<RegisterItem>>();

  const type = (params.type as string);
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "7");

  const queryObj = new URLSearchParams();
  queryObj.set("page", page.toString());
  queryObj.set("limit", limit.toString());
  if (search) {
    queryObj.set("search", search);
  }
  const queryString = queryObj.toString();


  //Fetch all register types (for labels)
  useEffect(() => {
    executeRegisters("/api/register/all");
  }, [executeRegisters]);

  //Fetch paginated items for current type
  useEffect(() => {
    execute(`/api/register/${type}?${queryString}`);
  }, [type, queryString, execute]);


  const items = data?.items || [];
  const pagination = {
    page: data?.pagination?.current_page || 1,
    limit: data?.pagination?.page_size || 7,
    total: 500,  // total number of items not provided so for now it is static
    // Calculate these derived values if not provided by backend
    pageStart: data?.pagination?.current_page && data?.pagination?.page_size ? (data.pagination.current_page - 1) * data.pagination.page_size : 0,
    pageEnd: (data?.pagination?.current_page && data?.pagination?.page_size ? (data.pagination.current_page - 1) * data.pagination.page_size : 0) + items.length,
  };

  const currentRegister = registersData?.find(r => r.register_mnemonic.toLowerCase() === type.toLowerCase());
  const registerTypelabel = currentRegister?.register_subject || "Register";

  const breadcrumb = [
    { label: registerTypelabel, href: undefined },
  ];

  const handlePrev = () => {
    if (pagination.page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (pagination.page - 1).toString());
      router.push(`/register/${type}?${params.toString()}`);
    }
  };

  const handleNext = () => {
    if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (pagination.page + 1).toString());
      router.push(`/register/${type}?${params.toString()}`);
    }
  };

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
        onFilters={() => console.log("filters")}
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
            items.map((item) => (
              <Link
                key={item.id}
                href={`/register/${type}/${item.id}`}
                className="block"
              >
                <div className="flex items-center gap-6 p-5 bg-white border-2 border-gray-300 rounded-md hover:shadow-sm hover:border-gray-400 transition-all">
                  <div className="w-16 h-16 bg-gray-300 rounded-md shrink-0"></div>

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
