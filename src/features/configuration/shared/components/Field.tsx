'use client';

interface FieldProps {
    label: string;
    value?: any;
    className?: string;
}

export default function Field({ label, value, className = '' }: FieldProps) {
    return (
        <div className={`grid grid-cols-[1.2fr_2fr] gap-4 py-2 ${className}`}>
            <span className="text-black/50 text-[16px] font-medium truncate" title={label}>
                {label}
            </span>
            <div className="text-black text-[16px] font-medium break-all">
                {value ?? '-'}
            </div>
        </div>
    );
}