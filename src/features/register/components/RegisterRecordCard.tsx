'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { RegisterRecord } from '../types';
import { sortedDisplayFields } from '../utils';

interface RegisterRecordCardProps {
    record: RegisterRecord;
    registerType: string;
    isEven: boolean;
}

export function RegisterRecordCard({ record, registerType, isEven }: RegisterRecordCardProps) {
    const t = useTranslations();
    const sortedFields = sortedDisplayFields(record.display_fields);

    return (
        <Link
            key={record.internal_record_id}
            href={`/register/${registerType}/${record.internal_record_id}`}
            className="block w-full"
        >
            <div className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 p-4 w-full overflow-hidden ${isEven
                ? 'bg-[#D9D9D940]'
                : 'bg-white'
                }`}>
                {record.record_image_url ? (
                    <img
                        src={record.record_image_url}
                        alt={record.record_name}
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-md object-cover shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-300 rounded-md shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#ED7C22] text-[16px] mb-0.5">
                        {record.record_name}
                    </h3>
                    <p className="text-[16px] text-gray-600">
                        <span className="font-normal">{t('id')} :</span>{' '}
                        <span className="font-medium text-black">
                            {record.functional_record_id}
                        </span>
                    </p>
                </div>

                {[0, 2, 4].map((startIndex) => {
                    const firstField = sortedFields[startIndex];
                    const secondField = sortedFields[startIndex + 1];

                    return (
                        <div key={startIndex} className="flex-1 min-w-0">
                            {firstField ? (
                                <p className="text-[16px] text-black truncate">
                                    <span className="font-normal text-gray-600">
                                        {t(firstField.field_name)}:{' '}
                                    </span>
                                    <span className="font-medium">{firstField.value}</span>
                                </p>
                            ) : (
                                <p className="text-[16px] invisible">&nbsp;</p>
                            )}
                            {secondField ? (
                                <p className="text-[16px] text-black truncate">
                                    <span className="font-normal text-gray-600">
                                        {t(secondField.field_name)}:{' '}
                                    </span>
                                    <span className="font-medium">{secondField.value}</span>
                                </p>
                            ) : (
                                <p className="text-[16px] invisible">&nbsp;</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Link>
    );
}
