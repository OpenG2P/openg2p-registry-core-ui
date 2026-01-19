'use client';
interface Props {
    isSearchView?: boolean;
}

export default function ChangeLogSkeleton({
    isSearchView = false,
}: Props) {
    return (
        <div className={`rounded-[30px] bg-white px-10 py-10 animate-pulse ${!isSearchView ? 'mr-60' : ''}`}>
            <div
                className={`grid gap-6 ${isSearchView
                    ? "grid-cols-1 md:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-3"
                    }`}
            >
                <div className="space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-4 bg-gray-300 rounded w-1/3" />
                    <div className="h-4 bg-gray-300 rounded w-1/4" />
                </div>

                <div className="space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4 invisible" />
                    <div className="space-y-2 border-l-3 border-[#D9D9D9] pl-6">
                        <div className="h-4 bg-gray-300 rounded w-2/3" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-1/3" />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-1 pl-6">
                        <div className="h-6 bg-gray-300 rounded w-32" />
                        <div className="w-4 h-4 bg-gray-300 rounded" />
                    </div>
                    <div className="flex flex-col gap-2 font-semibold border-l-3 border-[#D9D9D9] pl-6">
                        <div className="h-4 bg-gray-300 rounded w-40" />
                        <div className="h-4 bg-gray-300 rounded w-36" />
                        <div className="h-4 bg-gray-300 rounded w-28" />
                    </div>
                </div>
                {isSearchView && (
                    <div className="space-y-3">
                        <div className="h-6 bg-gray-300 rounded w-3/4" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-1/3" />
                        <div className="h-4 bg-gray-300 rounded w-1/4" />
                    </div>
                )}
            </div>

            <div className="my-4 border-t-3 border-[#D9D9D9]" />

            <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-24 opacity-50" />
            </div>
        </div>
    );
}
