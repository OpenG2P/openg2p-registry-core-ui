"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BreadcrumbBar } from "@/components/shared";
import { SectionsContainer, WidgetProvider } from "@openg2p/registry-widgets";
import type { UISchema } from "@openg2p/registry-widgets";
import uiSchema from '@/features/individual-details/schemas/UISchema.json';


interface PersonalDetails {
  name: string;
  id: string;
  dob: string;
  phone: string;
  mailId: string;
  village: string;
  zone: string;
  area: string;
}

interface OtherDetail {
  title: string;
  items: Array<{ label: string; value: string }>;
}

interface RegistryDetail {
  id: string;
  name: string;
  personalDetails: PersonalDetails;
  otherDetails: OtherDetail[];
  changeRequest: {
    id: string;
    title: string;
    description: string;
  };
  versionHistory: {
    id: string;
    title: string;
    description: string;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    lastApprovedBy: string;
    lastApprovedAt: string;
  };
  tabs: string[];
}

export default function RegistryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const type = (params.type as string) || "individual";

  const [detail, setDetail] = useState<RegistryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [uiSchema, setUiSchema] = useState<UISchema | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch("/api/uischema");
        const data: UISchema = await res.json();
        setUiSchema(data);
      } catch (error) {
        console.error("Error fetching UI schema:", error);
      }
    };

    fetchSchema();
  }, []);


  const typeLabels: Record<string, string> = {
    individual: "Individuals",
    individuals: "Individuals",
    family: "Families",
    families: "Families",
    crops: "Crops",
    lands: "Lands",
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/registry/${type}/${id}`);
        const data = await response.json();
        setDetail(data);
      } catch (error) {
        console.error("Error fetching registry detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-500">Record not found</div>
      </div>
    );
  }

  const breadcrumb = [
    { label: typeLabels[type] || "Registry", href: `/registry/${type}` },
    {
      label: `${detail.name} - ID ${detail.id}`,
      href: undefined,
    },
    { label: detail.tabs[activeTab] || "Tab 01", href: undefined },
  ];

  if (loading || !uiSchema) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-10 py-4 bg-white border-b border-gray-300">
        <BreadcrumbBar breadcrumb={breadcrumb} />
      </div>

      <div className="px-10 py-6">
        <div className="flex gap-2 mb-6 border-b-4 border-gray-300">
          {detail.tabs.map((tab, index) => (
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

        {activeTab === 0 ? (
          <WidgetProvider>
            <SectionsContainer sections={uiSchema.sections} />
          </WidgetProvider>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}