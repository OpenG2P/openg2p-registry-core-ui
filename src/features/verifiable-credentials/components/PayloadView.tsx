'use client';

interface PayloadViewProps {
    data: any;
}

export default function PayloadView({ data }: PayloadViewProps) {
    return (
        <div className="flex-1 bg-[#D9D9D980] px-6 py-3 overflow-y-auto overflow-x-auto message-json-scroll">
            <pre className="text-[14px] text-black whitespace-pre">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
