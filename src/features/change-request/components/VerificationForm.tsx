import { useState } from "react";
import Image from "next/image";

interface Props {
    onSubmit: (observation: string, isApproved: boolean) => Promise<boolean>;
    onClose: () => void;
}

export default function VerificationForm({ onSubmit, onClose }: Props) {
    const [observation, setObservation] = useState("");
    const [isApproved, setIsApproved] = useState(true);

    const handleSubmit = async () => {
        const success = await onSubmit(observation, isApproved);
        if (success) {
            setObservation("");
            setIsApproved(true);
            onClose();
        }
    };

    return (
        <div className="relative border border-[#F2BA1A] rounded-[25px] p-6 text-sm space-y-3 bg-white">
            <button
                onClick={onClose}
                className="absolute top-4 right-4"
            >
                <Image
                    src="/close.png"
                    alt="close"
                    width={22}
                    height={22}
                    className="opacity-70 hover:opacity-100"
                />
            </button>

            <div className="font-semibold text-black/50">
                New Verification
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
                        John Smith
                        <span className="ml-2 text-[14px] text-black/50">You</span>
                    </span>
                    <span className="text-[14px] text-black/50">
                        {new Date().toLocaleString()}
                    </span>
                </div>
            </div>

            <div>
                <div className="text-[14px] font-medium text-black/50 mb-1">
                    Message
                </div>
                <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    rows={1}
                    placeholder="Type your message here..."
                    className="w-full border border-black/25 rounded-md p-2 text-sm resize-none focus:outline-none"
                />
            </div>

            <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-6">
                    <CheckboxOption
                        label="OK"
                        checked={isApproved}
                        onClick={() => setIsApproved(true)}
                    />
                    <CheckboxOption
                        label="Not OK"
                        checked={!isApproved}
                        onClick={() => setIsApproved(false)}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="px-4 py-1.5 text-sm rounded-xl bg-black text-white"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

const CheckboxOption = ({
    label,
    checked,
    onClick,
}: {
    label: string;
    checked: boolean;
    onClick: () => void;
}) => (
    <label
        className="flex items-center gap-2 cursor-pointer"
        onClick={onClick}
    >
        <input type="checkbox" checked={checked} readOnly className="hidden" />
        <div
            className={`w-6 h-6 border rounded flex items-center justify-center ${checked ? "border-[#ED7C22]" : "border-gray-300"
                }`}
        >
            {checked && (
                <Image src="/tick.png" alt="tick" width={16} height={16} />
            )}
        </div>
        <span className="text-gray-700">{label}</span>
    </label>
);