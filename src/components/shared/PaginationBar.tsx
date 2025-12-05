"use client";

import Image from "next/image";

export default function PaginationBar({
    pageStart,
    pageEnd,
    total,
    onPrev,
    onNext
}: any) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-[120px] text-center">
                {pageStart} - {pageEnd} of {total}
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    className="h-[30px] w-[30px] flex items-center justify-center border rounded bg-white hover:bg-gray-100"
                >
                    <Image
                        src="/right_arrow.png"
                        width={14}
                        height={14}
                        alt="prev"
                        className="rotate-180"
                    />
                </button>

                <button
                    onClick={onNext}
                    className="h-[30px] w-[30px] flex items-center justify-center border rounded bg-white hover:bg-gray-100"
                >
                    <Image
                        src="/right_arrow.png"
                        width={14}
                        height={14}
                        alt="next"
                    />
                </button>
            </div>
        </div>
    );
}
