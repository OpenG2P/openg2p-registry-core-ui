import Image from "next/image";
import { Verification } from "@/features/change-request/types/change-request";
import { useTranslations } from "next-intl";

interface VerificationCardProps {
    verification: Verification;
}

export default function VerificationCard(props: VerificationCardProps) {
    const { verification } = props;
    const t = useTranslations();
    return (
        <div className="bg-[#E0E0E0] rounded-[25px] p-6 space-y-3">
            <div className="font-normal text-[14px] text-black/50">
                {t("verifiedBy")}
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
                    <span className="text-[14px] text-black/50 font-normal">
                        {new Date(verification.verified_at).toLocaleString()}
                    </span>
                </div>
            </div>

            <div>
                <div className="text-[14px] font-normal text-black/50 mb-1">
                    {t("message")}
                </div>
                <div className="text-[16px] text-black font-normal">
                    {verification.verification_observations}
                </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
                <StatusIndicator
                    label={t("ok")}
                    isActive={verification.is_approved}
                />
                <StatusIndicator
                    label={t("notOk")}
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
        <span className="text-[14px] font-medium text-black">{label}</span>
    </div>
);