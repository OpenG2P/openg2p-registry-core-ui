'use client';

interface FieldProps {
    label: string;
    value?: any;
}

// export default function Field({ label, value }: FieldProps) {
//     return (
//         <div>
//             <label className="text-[16px] font-medium">
//                 {label}
//             </label>
//             <div
//                 className="mt-2 w-full border border-[#F77F57] py-2 px-4 rounded-[10px] truncate"
//                 title={value}
//             >
//                 {value ?? '-'}
//             </div>
//         </div>
//     );
// }

export default function Field({ label, value }: FieldProps) {
    return (
        <div className="flex gap-4 items-center">
            <span
                className="text-[16px] text-black/50 truncate"
                title={label}
            >
                {label} :
            </span>

            <div
                className="text-base font-medium text-black truncate"
                title={value}
            >
                {value ?? '-'}
            </div>
        </div>
    );
}