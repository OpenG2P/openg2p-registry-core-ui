'use client';

interface Props {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}

export default function InputField({ label, value, onChange, placeholder, type = "text" }: Props) {
    return (
        <div>
            <label className="text-[16px] font-medium text-neutral-first">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full border border-primary-second py-2 px-4 rounded-[10px] outline-none"
            />
        </div>
    );
}