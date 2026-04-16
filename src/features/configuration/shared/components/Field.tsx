'use client';

interface FieldProps {
    label: string;
    value?: any;
    className?: string;
}

<<<<<<< HEAD
export default function Field({ label, value, className = '' }: FieldProps) {
    return (
        <div className={`grid grid-cols-[1.2fr_2fr] gap-4 py-3 ${className}`}>
            <span className="text-[#808080] text-[16px] font-medium truncate" title={label}>
=======
export default function Field({ label, value }: FieldProps) {
    return (
        <div className="grid grid-cols-[220px_1fr] items-center gap-2">
            <span
                className="text-[16px] text-black/50 truncate"
                title={label}
            >
>>>>>>> dc5e7c9 (G2P-4561 Add link for template file)
                {label}
            </span>
            <div className="text-black text-[16px] font-bold break-all">
                {value ?? '-'}
            </div>
        </div>
    );
}