'use client';

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  BreadcrumbBar,
  ChangeRequestCard,
  VersionHistoryCard,
} from "@/components/shared";
import {
  SectionsContainer,
  UISchema,
  WidgetProvider,
} from "@/openg2p-registry-ui-widgets/src";
import { useFetch } from "@/shared/hooks/useFetch";
import { ResponseBody } from "@/shared";

interface Register {
  register_id: string;
  register_mnemonic: string;
  register_subject: string;
  register_description: string;
  master_register_id: string;
}

export default function RegisterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const type = params.type as string;

  const [activeTab, setActiveTab] = useState(0);

  /** Fetch UI schema */
  const { data: dataUISchema } = useFetch<any>({
    url: `/api/register/${type}/uischema`,
    deps: [type, id],
  });

  /** Fetch all register types */
  const { data: registersData } = useFetch<ResponseBody>({
    url: "/api/register/all",
    deps: [],
  });

  const registers: Register[] =
    registersData?.response_payload ?? [];

  const currentRegister = useMemo(
    () =>
      registers.find(
        (r) =>
          r.register_mnemonic.toLowerCase() ===
          type.toLowerCase()
      ),
    [registers, type]
  );

  /** Fetch record details */
  const { data: recordData } = useFetch<any>({
    url: currentRegister?.register_id
      ? `/api/register/${type}/${id}`
      : null,
    deps: [currentRegister?.register_id, id, type],
    enabled: !!currentRegister?.register_id,
    options: {
      method: "POST",
      body: JSON.stringify({
        register_id: currentRegister?.register_id,
        internal_record_id: id,
      }),
    },
  });

  const schemaData = recordData?.response_payload?.additional_fields
  const uiSchema = dataUISchema?.response_payload as UISchema | undefined;
  const breadcrumb = currentRegister
    ? [
      {
        label: currentRegister.register_subject,
        href: `/register/${type}`,
      },
    ]
    : [];

  const DUMMY_TABS = ["Tab 1", "Tab 2", "Tab 3"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-10 py-4 bg-white border-b border-gray-300">
        <BreadcrumbBar breadcrumb={breadcrumb} />
      </div>

      <div className="px-10 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-4 border-gray-300">
          {DUMMY_TABS.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-12 py-3 font-bold transition-all rounded-t-lg ${activeTab === index
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 0 && uiSchema && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              <WidgetProvider schemaData={schemaData}>
                <SectionsContainer sections={uiSchema.sections} />
              </WidgetProvider>
            </div>

            <div className="col-span-3 flex flex-col gap-6">
              {currentRegister && (
                <>
                  <ChangeRequestCard
                    registerId={currentRegister.register_id}
                    internalRecordId={id}
                  />
                  <VersionHistoryCard
                    registerId={currentRegister.register_id}
                    internalRecordId={id}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
