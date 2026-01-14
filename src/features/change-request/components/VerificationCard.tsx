import Image from "next/image";
import { Verification } from "@/features/change-request/types/change-request";

interface VerificationCardProps {
    verification: Verification;
}

export default function VerificationCard(props: VerificationCardProps) {
    const { verification } = props;
    return (
        <div className="bg-[#E0E0E0] rounded-[25px] p-6 space-y-3">
            <div className="font-semibold text-[14px] text-black/50">
                Verified by
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative">
                    <Image
                        src="/verified_person.png"
                        alt="verified person"
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-[20px] font-medium text-black">
                        {verification.verified_by}
                    </span>
                    <span className="text-[14px] text-black/50">
                        {new Date(verification.verified_at).toLocaleString()}
                    </span>
                </div>
            </div>

            <div>
                <div className="text-[14px] font-medium text-black/50 mb-1">
                    Message
                </div>
                <div className="text-[16px] text-black">
                    {verification.verification_observations}
                </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
                <StatusIndicator
                    label="OK"
                    isActive={verification.is_approved}
                />
                <StatusIndicator
                    label="Not OK"
                    isActive={!verification.is_approved}
                />
            </div>
        </div>
    );
}

const StatusIndicator = ({
    label,
    isActive,
}: {
    label: string;
    isActive: boolean;
}) => (
    <div className="flex items-center gap-2 text-gray-700">
        <div
            className={`w-6 h-6 border rounded flex items-center justify-center ${isActive ? "border-[#ED7C22] bg-white" : "border-gray-300 bg-white"
                }`}
        >
            {isActive && (
                <Image src="/tick.png" alt="tick" width={16} height={16} />
            )}
        </div>
        <span>{label}</span>
    </div>
);