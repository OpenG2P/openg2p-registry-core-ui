export type KeyValueVariant = 'split' | 'deduplication' | 'message';

export interface KeyValueProps {
    label: string;
    value: string;
    valueClassName?: string;
    variant?: KeyValueVariant;
    className?: string;
}

/**
 * Label/value row used across cards (submissions, change requests, messages, deduplication).
 */
export function KeyValue({
    label,
    value,
    valueClassName,
    variant = 'split',
    className = '',
}: KeyValueProps) {
    const root = className.trim();

    if (variant === 'deduplication') {
        return (
            <div
                className={`flex w-full overflow-hidden font-normal leading-[26px] text-neutral-first${root ? ` ${root}` : ''}`}
            >
                <span className="w-1/2 truncate text-[16px] text-neutral-first/50" title={label}>
                    {label} :{' '}
                </span>
                <span
                    className="w-1/2 truncate pl-4 text-[16px] font-normal text-neutral-first"
                    title={value}
                >
                    {value}
                </span>
            </div>
        );
    }

    if (variant === 'message') {
        return (
            <div className={`text-neutral-first${root ? ` ${root}` : ''}`}>
                <span className="text-[16px] text-neutral-first/50">{label}: </span>
                <span className={`text-[14px] font-medium ${valueClassName ?? 'text-neutral-first'}`}>{value}</span>
            </div>
        );
    }

    return (
        <div
            className={`flex w-full overflow-hidden leading-relaxed text-neutral-first${root ? ` ${root}` : ''}`}
        >
            <span className="w-1/2 truncate text-[16px] font-normal text-neutral-first/50" title={label}>
                {label}:{' '}
            </span>
            <span
                className={`w-1/2 truncate text-[14px] font-medium ${valueClassName ?? 'text-neutral-first'}`}
                title={value}
            >
                {value}
            </span>
        </div>
    );
}
