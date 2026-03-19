"use client";

import { useState } from "react";
import {
    WidgetProvider,
    SectionRenderer,
} from "@openg2p/registry-widgets";
import { dataSourceRequestHandler } from "@/features/register/utils/dataSourceRequestHandler";
import type { SectionConfig } from "@openg2p/registry-widgets";

type TabType = "values" | "duplicates";

export function ChangeRequestValuesTabs({
    widgetStoreNew,
    widgetStoreOld,
    newSectionData,
    oldSectionData,
    sectionUISchema,
    t,
}: any) {
    const [activeTab, setActiveTab] = useState<TabType>("values");

    return (
        <div className="mt-7.5">
            <div className="ml-7.5">
                <button
                    onClick={() => setActiveTab("values")}
                    className={`px-8 py-2 text-black text-[18px] font-medium rounded-t-[10px] transition-all ${activeTab === "values"
                        ? 'bg-[#F2BA1A]'
                        : 'bg-[#DDDDDD]'
                        }`}
                >
                    {t("newAndOldValues")}
                </button>

                <button
                    onClick={() => setActiveTab("duplicates")}
                    className={`ml-2 px-8 py-2 text-black text-[18px] font-medium rounded-t-[10px]
                        ${
                            activeTab === "duplicates"
                                ? "bg-[#F2BA1A]"
                                : "bg-[#DDDDDD]"
                        }`}
                >
                   {t("possible_duplicates")}
                </button>
                
            </div>

            {/* Content */}
            {/* <div className="border border-gray-200 rounded-b-lg rounded-tr-lg p-4 bg-white"> */}
            {activeTab === "values" && newSectionData && sectionUISchema && (
                <div className="flex flex-col gap-4">
                    <WidgetProvider
                        store={widgetStoreNew}
                        schemaData={newSectionData}
                        translate={t}
                    dataSourceRequestHandler={dataSourceRequestHandler}
                    >
                        <SectionRenderer
                            section={sectionUISchema}
                            hideEditButton={true}
                            mode="CRView"
                            changeRequestType="new"
                        />
                    </WidgetProvider>

                    <WidgetProvider
                        store={widgetStoreOld}
                        schemaData={oldSectionData}
                        translate={t}
                        dataSourceRequestHandler={dataSourceRequestHandler}
                    >
                        <SectionRenderer
                            section={sectionUISchema}
                            hideEditButton={true}
                            mode="CRView"
                            changeRequestType="old"

                        />
                    </WidgetProvider>
                </div>
            )}

            {/*
                {activeTab === "duplicates" && (
                    <div>
                        Possible duplicates renderer
                    </div>
                )}
                */}
            {/* </div> */}
        </div>
    );
}
