'use client';

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export default function InputField({ label, value, onChange }: Props) {
    return (
        <div>
            <label className="text-[16px] font-medium text-black">
                {label}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full border border-[#F77F57] py-2 px-4 rounded-[10px] outline-none"
            />
        </div>
    );
}