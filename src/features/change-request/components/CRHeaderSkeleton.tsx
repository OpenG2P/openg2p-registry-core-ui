const ChangeRequestHeaderSkeleton = () => {
    return (
        <div className="rounded-[25px] bg-[#F2BA1A33]/80 px-10 py-5 flex flex-col border border-dashed border-[#ED7C22] animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoSectionSkeleton />
                <VerificationStatsSkeleton />
                <AttachedDocumentsSkeleton />
            </div>

            <div className="my-4 border-t-2 border-[#F2BA1A]" />

            <div className="flex items-center gap-4">
                <div className="h-9 w-35 bg-gray-100 rounded-[20px]" />
                <div className="h-9 w-35 bg-black/20 rounded-[20px]" />
            </div>
        </div>
    );
};

export default ChangeRequestHeaderSkeleton


const InfoSectionSkeleton = () => {
    return (
        <div className="space-y-2 text-[16px]">
            <div className="h-6 w-45 bg-black/30 rounded" />

            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                    <div className="h-4.5 w-30 bg-black/20 rounded" />
                    <div className="h-4.5 w-35 bg-black/50 rounded" />
                </div>
            ))}
        </div>
    );
};


const VerificationStatsSkeleton = () => {
    return (
        <div className="space-y-2 text-[16px]">
            <div className="h-6 w-30 bg-transparent" />

            <div className="border-l-2 border-[#F2BA1A] pl-6 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-2">
                        <div className="h-4.5 w-50 bg-black/20 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};


const AttachedDocumentsSkeleton = () => {
    return (
        <div className="space-y-2 text-[16px]">
            <div className="pl-6 flex items-center gap-2">
                <div className="h-6 w-35 bg-black/30 rounded" />
            </div>

            <div className="border-l-2 border-[#F2BA1A] pl-6 flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="h-4.5 w-40 bg-black/20 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};
