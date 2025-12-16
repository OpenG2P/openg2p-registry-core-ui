"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BreadcrumbBar } from "@/components/shared";
import { SectionsContainer, UISchema, WidgetProvider } from "@/openg2p-registry-ui-widgets/src";
import { useFetch } from "@/shared/hooks/useFetch";

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

interface RegisterDetail {
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

export default function RegisterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const type = (params.type as string) || "individual";

  const { data: detail, loading, error, execute } = useFetch<RegisterDetail>();
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
    if (id) {
      execute(`/api/register/${type}/${id}`);
    }
  }, [id, type, execute]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!detail) {
    // If loading is false and no detail, it might be the initial state before fetch or null result.
    // If it's initial state (not loading, no data, no error), we might want to return null or loader.
    // However, useFetch sets loading to true immediately when execute is called? 
    // Actually execute is async. But inside execute it sets loading(true).
    // Initial state: data=null, loading=false.
    // So we should check if we initiated a fetch? 
    // Or just show "Record not found" if loading is complete and no data.
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-500">Record not found</div>
      </div>
    );
  }

  const breadcrumb = [
    { label: typeLabels[type] || "Register", href: `/register/${type}` },
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
