'use client';

export default function OutgoingMessageCardSkeleton() {
    return (
        <div className="rounded-[30px] bg-white px-10 py-8 animate-pulse">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 text-[16px] text-[#00000080]">
                <div className="space-y-3">
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-5 w-full max-w-45 bg-gray-300 rounded"></div>
                    ))}
                </div>

                <div className="border-l-2 border-[#D9D9D9] pl-6 space-y-3">
                    <div>
                        <div className="h-6 w-40 bg-gray-300 rounded mb-3"></div>
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-5 w-full max-w-35 bg-gray-300 rounded mb-2"></div>
                        ))}
                    </div>
                    <div>
                        <div className="h-6 w-24 bg-gray-300 rounded mb-3"></div>
                        <div className="h-5 w-20 bg-gray-300 rounded"></div>
                    </div>
                </div>

                <div className="border-l-2 border-[#D9D9D9] pl-6 space-y-3">
                    <div className="h-6 w-32 bg-gray-300 rounded"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-5 w-full max-w-40 bg-gray-300 rounded"></div>
                    ))}
                    <div className="h-5 w-20 bg-gray-300 rounded mt-2"></div>
                </div>
            </div>
        </div>
    );
}
