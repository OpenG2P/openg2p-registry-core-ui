import Image from "next/image";

interface ActionPopupProps {
    type: "approve" | "reject";
    onClose: () => void;
}

export default function ActionPopup({ type, onClose }: ActionPopupProps) {
    const isApprove = type === "approve";

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div
                className={`relative bg-white rounded-[40px] w-150 h-100 p-6 flex flex-col items-center justify-center gap-4 border-10 ${isApprove ? "border-[#77D79B]/80" : "border-[#EF8F93]/80"
                    }`}
            >
                <button
                    className="absolute top-10 right-10 opacity-50"
                    onClick={onClose}
                >
                    <Image src="/cr_close.png" alt="Close" width={30} height={30} />
                </button>

                <div
                    className={`w-20 h-20 relative rounded-full flex items-center justify-center border-10 ${isApprove
                            ? "border-[#77D79B]/10 bg-[#77D79B]/80"
                            : "border-[#EF8F93]/10 bg-[#EF8F93]/80"
                        }`}
                >
                    <Image
                        src={type === "approve" ? "/cr_approve.png" : "/cr_reject.png"}
                        alt={type === "approve" ? "Approved" : "Rejected"}
                        width={41}
                        height={30}
                        className="object-contain"
                    />
                </div>

                <h3 className="text-xl font-semibold text-center">
                    {type === "approve" ? "Approved Successfully" : "Thank you, for your information"}
                </h3>

                <p className="text-center text-gray-600">
                    {type === "approve"
                        ? "Thank you for approval, changes updated successfully"
                        : "Message submitted successfully"}
                </p>

                <button
                    onClick={onClose}
                    className="mt-4 bg-black text-[16px] text-white px-10 py-2 rounded-[20px]"
                >
                    Close
                </button>
            </div>
        </div>)
}