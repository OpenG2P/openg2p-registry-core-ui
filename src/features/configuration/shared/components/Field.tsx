'use client';

interface FieldProps {
    label: string;
    value?: any;
}

export default function Field({ label, value }: FieldProps) {
    return (
        <div>
            <label className="text-[16px] font-medium">
                {label}
            </label>
            <div
                className="mt-2 w-full border border-[#F77F57] py-2 px-4 rounded-[10px] truncate"
                title={value}
            >
                {value ?? '-'}
            </div>
        </div>
    );
}