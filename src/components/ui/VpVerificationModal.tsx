'use client';

import Image from 'next/image';
import VpVerification from './VpVerification';

interface Props {
    descriptorSchema: any;
    onClose: () => void;
}

export default function VpVerificationModal({
    descriptorSchema,
    onClose,
}: Props) {

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-[40px] w-150 h-105 p-10 border-10 border-[#F2BA1A] flex flex-col">
                <button
                    className="absolute top-8 right-8 opacity-50"
                    onClick={onClose}
                >
                    <Image src="/cr_close.png" alt="Close" width={30} height={30} />
                </button>

                <div className="flex-1 overflow-auto">
                    <VpVerification descriptorSchema={descriptorSchema}/>
                </div>

                {/* <div className="mt-6 flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="bg-black text-white px-10 py-2 rounded-[20px]"
                    >
                        Close
                    </button>
                </div> */}
            </div>
        </div>
    );
}
