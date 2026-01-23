"use client";

import Image from "next/image";

interface PaginationBarProps {
    pageStart: number;
    pageEnd: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}

const formatNumber = (num: number) => {
    if (num < 1000) return num.toString();
    if (num >= 1000000000) {
        const val = num / 1000000000;
        return `${val < 10 ? val.toFixed(1).replace(/\.0$/, "") : Math.floor(val)}B`;
    }
    if (num >= 1000000) {
        const val = num / 1000000;
        return `${val < 10 ? val.toFixed(1).replace(/\.0$/, "") : Math.floor(val)}M`;
    }
    const val = num / 1000;
    return `${val < 10 ? val.toFixed(1).replace(/\.0$/, "") : Math.floor(val)}k`;
};

export default function PaginationBar({
    pageStart,
    pageEnd,
    total,
    onPrev,
    onNext,
}: PaginationBarProps) {
    const isPrevDisabled = pageStart <= 1;
    const isNextDisabled = pageEnd >= total;

    return (
        <div className="flex items-center gap-2">
            <span className="min-w-[80px] px-2 h-[19px] text-center font-normal text-[16px] text-[#1E1E1E] whitespace-nowrap">
                {formatNumber(pageStart)} - {formatNumber(pageEnd)} of {formatNumber(total)}
            </span>


            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={isPrevDisabled}
                    className={`w-10 h-[34px] flex items-center justify-center rounded-[17px]
            ${isPrevDisabled
                            ? "bg-[#F2BA1A] cursor-not-allowed"
                            : "bg-[#F2BA1A]"
                        }`}
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
                    disabled={isNextDisabled}
                    className={`w-10 h-[34px] flex items-center justify-center rounded-[17px]
            ${isNextDisabled
                            ? "bg-[#F2BA1A] cursor-not-allowed"
                            : "bg-[#F2BA1A]"
                        }`}
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
