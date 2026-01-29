'use client';

import Image from 'next/image';

interface StatusViewProps {
    vp: any;
}

export default function StatusView({ vp }: StatusViewProps) {
    const payload = vp?.decodedJwt?.payload;
    const status = vp?.vcStatus;
    const isSuccess = status === 'SUCCESS';
    return (
        <div className="flex-1">
            <div className="grid grid-cols-3 gap-6 min-h-60">
                <div className="bg-gray-100 p-10 flex flex-col justify-center items-center text-center">
                    <p className="text-[16px] text-gray-500 mb-2">Credential Type</p>
                    <p className="text-[16px] font-semibold">
                        {payload?.vct ?? '—'}
                    </p>
                </div>

                <div className="bg-gray-100 p-10 flex flex-col justify-center items-center text-center">
                    <p className="text-[16px] text-gray-500 mb-2">Credential ID</p>
                    <p className="text-[16px] font-semibold">
                        {payload?.id ?? '—'}
                    </p>
                </div>

                <div className="bg-gray-100 p-10 flex flex-col justify-center items-center text-center">
                    <Image
                        src={isSuccess ? '/verified.png' : '/invalid.png'}
                        alt={status}
                        width={48}
                        height={48}
                        className={`mb-2 p-1 rounded-full ${isSuccess ? '' : 'bg-red-500'}`}
                    />

                    <p className="text-[16px] text-gray-500 mb-2">Verification Result</p>
                    <p
                        className={`text-[16px] font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
}
