// "use client";

// import Image from "next/image";

// export default function PaginationBar({
//     pageStart,
//     pageEnd,
//     total,
//     onPrev,
//     onNext
// }: any) {
//     return (
//         <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-700 w-[120px] text-center">
//                 {pageStart} - {pageEnd} of {total}
//             </span>

//             <div className="flex items-center gap-2">
//                 <button
//                     onClick={onPrev}
//                     className="h-[30px] w-[30px] flex items-center justify-center border rounded bg-white hover:bg-gray-100"
//                 >
//                     <Image
//                         src="/right_arrow.png"
//                         width={14}
//                         height={14}
//                         alt="prev"
//                         className="rotate-180"
//                     />
//                 </button>

//                 <button
//                     onClick={onNext}
//                     className="h-[30px] w-[30px] flex items-center justify-center border rounded bg-white hover:bg-gray-100"
//                 >
//                     <Image
//                         src="/right_arrow.png"
//                         width={14}
//                         height={14}
//                         alt="next"
//                     />
//                 </button>
//             </div>
//         </div>
//     );
// }

"use client";

import Image from "next/image";

interface PaginationBarProps {
    pageStart: number;
    pageEnd: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function PaginationBar({
    pageStart,
    pageEnd,
    total,
    onPrev,
    onNext,
}: PaginationBarProps) {
    if (total === 0) return null;

    const isPrevDisabled = pageStart <= 1;
    const isNextDisabled = pageEnd >= total;

    return (
        <div className="flex items-center gap-2">
            <span className="w-[80px] h-[19px] text-center font-normal text-[16px] text-[#1E1E1E]">
            {pageStart} - {pageEnd} of {total}
            </span>


            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={isPrevDisabled}
                    className={`w-[40px] h-[34px] flex items-center justify-center rounded-[17px]
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
                    className={`w-[40px] h-[34px] flex items-center justify-center rounded-[17px]
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
