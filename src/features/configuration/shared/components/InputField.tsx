'use client';

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;

    type?: 'text' | 'number';
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    placeholder?: string;
}

export default function InputField({
    label,
    value,
    onChange,
    type = 'text',
    min,
    max,
    step,
    disabled = false,
    placeholder = '', 
}: Props) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (type === 'number') {
            if (val === '') {
                onChange('');
                return;
            }

            if (isNaN(Number(val))) return;

            const num = Number(val);

            if (min !== undefined && num < min) return;
            if (max !== undefined && num > max) return;
        }

        onChange(val);
    };

    return (
        <div>
            <label className="text-[16px] font-medium text-black">
                {label}
            </label>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                min={type === 'number' ? min : undefined}
                max={type === 'number' ? max : undefined}
                step={type === 'number' ? step : undefined}
                disabled={disabled}
                onWheel={type === 'number' ? (e) => e.currentTarget.blur() : undefined}
                className="mt-2 w-full border border-[#F77F57] py-2 px-4 rounded-[10px] outline-none disabled:opacity-50 placeholder:text-gray-400"
            />
        </div>
    );
}