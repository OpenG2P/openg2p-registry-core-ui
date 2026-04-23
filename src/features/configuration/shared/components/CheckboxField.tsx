'use client';

interface Props {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

export default function CheckboxField({
    label,
    checked,
    onChange,
    disabled = false,
}: Props) {
    return (
        <div>
            <label className="text-[16px] font-medium text-black">
                {label}
            </label>

            <div className="mt-2 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                />
            </div>
        </div>
    );
}