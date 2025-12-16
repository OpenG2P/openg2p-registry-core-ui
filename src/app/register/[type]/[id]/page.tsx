"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BreadcrumbBar } from "@/components/shared";
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Personal Details</h2>

                <div className="flex gap-6">
                  <div className="flex gap-6 items-start pr-6 border-r border-gray-200">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name : </span>
                        <span className="text-sm font-medium">{detail.personalDetails.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ID : </span>
                        <span className="text-sm font-medium">{detail.personalDetails.id}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">DOB : </span>
                        <span className="text-sm font-medium">{detail.personalDetails.dob}</span>
                      </div>
                    </div>

                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2 px-6 border-r border-gray-200">
                    <div>
                      <span className="text-sm text-gray-600">Phone : </span>
                      <span className="text-sm font-medium">{detail.personalDetails.phone}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mail ID : </span>
                      <span className="text-sm font-medium">{detail.personalDetails.mailId}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pl-6">
                    <div>
                      <span className="text-sm text-gray-600">Village : </span>
                      <span className="text-sm font-medium">{detail.personalDetails.village}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Zone : </span>
                      <span className="text-sm font-medium">{detail.personalDetails.zone}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Area : </span>
                      <span className="text-sm font-medium">{detail.personalDetails.area}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="text-sm font-medium flex items-center gap-2 hover:underline">
                    Edit Details
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
