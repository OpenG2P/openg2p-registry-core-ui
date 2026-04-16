'use client';

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    cols?: number;
    className?: string;
    textareaClassName?: string;
}

export default function TextAreaField({
    label,
    value,
    onChange,
    rows = 3,
    cols,
    className = '',
    textareaClassName = ''
}: Props) {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-[16px] font-medium text-black">
                {label}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                cols={cols}
                className={`mt-2 w-full border border-[#F77F57] p-2 px-4 rounded-[10px] outline-none bg-[#F9F9F9] font-mono text-sm ${textareaClassName}`}
            />
        </div>
    );
}
