
// export default function Home() {
//   return (
//     <div >
//       HomePage
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import TopBar from "@/components/shared/TopBar";

export default function IndividualsPage() {
    const items = [
        { name: "Sarah Elizabeth 01", id: "1234567890" },
        { name: "Individual Name 02", id: "1234567890" },
        { name: "Individual Name 03", id: "1234567890" },
        { name: "Individual Name 04", id: "1234567890" },
        { name: "Individual Name 05", id: "1234567890" },
        { name: "Individual Name 06", id: "1234567890" },
        { name: "Individual Name 07", id: "1234567890" }
    ];

    const [selected, setSelected] = useState<any>(null);

    // Breadcrumb for top bar
    const breadcrumb = selected
        ? [
            { label: "Individuals", href: "/individuals" },
            { label: `${selected.name} (${selected.id})` }
        ]
        : [
            { label: "Individuals", href: "/individuals" }
        ];

    return (
        <div className="min-h-screen bg-gray-100 mt-20 mx-[50px]">

            <TopBar
                breadcrumb={breadcrumb}
                showFilters={!selected}
                showPagination={!selected}
                pageStart={1}
                pageEnd={10}
                total={250}
                onPrev={() => console.log("prev")}
                onNext={() => console.log("next")}
                onFilters={() => console.log("filters")}
            />

            {!selected && (
                <div className="p-5 flex flex-col gap-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSelected(item)}
                            className="cursor-pointer"
                        >
                            <IndividualCard item={item} />
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <div className="p-5">
                    <div className="bg-white p-5 rounded-xl shadow border">
                        <h2 className="font-bold text-xl mb-2">{selected.name}</h2>
                        <p className="text-gray-600 mb-4">ID: {selected.id}</p>

                        <button
                            onClick={() => setSelected(null)}
                            className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}



export function IndividualCard({ item }: any) {
    return (
        <div className="w-full bg-white rounded-xl p-4 shadow border border-gray-200 flex items-center gap-6 hover:bg-gray-50 transition">

            {/* Avatar */}
            <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">IMG</span>
            </div>

            {/* Name + ID */}
            <div className="flex flex-col w-[25%]">
                <span className="font-semibold text-lg">{item.name}</span>
                <span className="text-sm text-gray-600">ID : {item.id}</span>
            </div>

            {/* Label groups */}
            <div className="grid grid-cols-3 w-full gap-4">
                {[1, 2, 3].map((col) => (
                    <div key={col} className="flex flex-col text-sm">
                        <span>Label 1: <b>Value1</b></span>
                        <span>Label 2: <b>Log Value 2</b></span>
                    </div>
                ))}
            </div>
        </div>
    );
}
