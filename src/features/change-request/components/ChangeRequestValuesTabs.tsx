"use client";

import { useState } from "react";
import {
    WidgetProvider,
    SectionRenderer,
} from "@openg2p/registry-widgets";
import { dataSourceRequestHandler } from "@/features/register/utils/dataSourceRequestHandler";

type TabType = "values" /* | "duplicates" */;

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

                {/*
                <button
                    onClick={() => setActiveTab("duplicates")}
                    className={`ml-2 px-6 py-3 text-sm font-medium border rounded-t-lg -mb-px
                        ${
                            activeTab === "duplicates"
                                ? "bg-white border-gray-200 border-b-white text-primary"
                                : "bg-gray-100 border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Possible Duplicates
                </button>
                */}
            </div>

            {/* Content */}
            {/* <div className="border border-gray-200 rounded-b-lg rounded-tr-lg p-4 bg-white"> */}
            {activeTab === "values" && newSectionData && sectionUISchema && (
                <div className="flex flex-col gap-4">
                    <WidgetProvider
                        store={widgetStoreNew}
                        schemaData={newSectionData}
                        translate={t}
                    // dataSourceRequestHandler={dataSourceRequestHandler}
                    >
                        <SectionRenderer
                            section={sectionUISchema}
                            hideEditButton={true}
                        />
                    </WidgetProvider>

                    <WidgetProvider
                        store={widgetStoreOld}
                        schemaData={oldSectionData}
                        translate={t}
                    // apiAdapter={dataSourceRequestHandler}
                    >
                        <SectionRenderer
                            section={sectionUISchema}
                            hideEditButton={true}
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
