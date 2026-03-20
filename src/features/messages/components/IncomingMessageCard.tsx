'use client';

import Image from 'next/image';
import { IncomingMessage } from '@/features/messages/types';
import { useState } from 'react';
import MessagePopup from './MessagePopup';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useIncomingMessagePayload } from '../hooks';
import { formatDateTime } from '@/shared/utils/dateUtils';

interface Props {
    message: IncomingMessage;
}

export default function IncomingMessageCard({ message }: Props) {
    const [openPopup, setOpenPopup] = useState(false);
    const locale = useLocale();

    const {
        fetchAll,
        rawJson,
        transformedJson,
        enrichedJson,
        loading,
    } = useIncomingMessagePayload();


    return (
        <div className="rounded-[10px] bg-white px-10 py-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-4 text-[16px] text-[#00000080]">
                {/* Column 1: Raw */}
                <div className="space-y-4">
                    <h3 className="text-[18px] font-semibold text-[#ED7C22] flex justify-between items-center">
                        <span>Raw</span>
                        <Image
                            src="/images/messages/chat.png"
                            alt="Raw Icon"
                            width={19}
                            height={20}
                            onClick={() => {
                                fetchAll(message.ingest_id);
                                setOpenPopup(true);
                            }}
                            className="cursor-pointer"
                        />
                    </h3>

                    <div className="space-y-2">
                        <KeyValue label="ID" value={message.ingest_id} />
                        <KeyValue label="Partner" value={message?.partner_mnemonic} />
                        <KeyValue label="Data Model" value={message?.data_model_mnemonic} />
                        <KeyValue label="Date & Time" value={formatDateTime(message.receipt_date_time)} />
                    </div>
                </div>

                {/* Column 2: Classification */}
                <div className="border-l-2 space-y-4 border-[#D9D9D9] pl-6">
                    <h3 className="text-[18px] font-semibold text-[#ED7C22]">Classification</h3>
                    <div className="space-y-2">
                        <KeyValue label="Status" value={message.classification_status} />
                        <KeyValue label="Date & Time" value={formatDateTime(message.classification_date_time)} />
                        <KeyValue label="Target Register" value={message.register_mnemonic ?? '-- -- --'} />

                    </div>


                </div>

                {/* Column 3: Transformation */}
                <div className="border-l-2 space-y-4 border-[#D9D9D9] pl-6">
                    <h3 className="text-[18px] font-semibold text-[#ED7C22] flex justify-between items-center">
                        <span>Transformation</span>
                        <Image
                            src="/images/messages/chat.png"
                            alt="Raw Icon"
                            width={19}
                            height={20}
                            onClick={() => {
                                fetchAll(message.ingest_id);
                                setOpenPopup(true);
                            }}
                            className="cursor-pointer"
                        />
                    </h3>

                    <div className="space-y-2">
                        <KeyValue label="Status" value={message.transformation_status ?? 'N/A'} />
                        <KeyValue label="Date & Time" value={formatDateTime(message.transformation_date_time)} />
                        <KeyValue label="Template" value={message.template_file_id ?? 'N/A'} />
                    </div>


                </div>

                {/* Column 4: Ingestion */}
                <div className="border-l-2 space-y-4 border-[#D9D9D9] pl-6">
                    <h3 className="text-[18px] font-semibold text-[#ED7C22]">Ingestion</h3>
                    <div className="space-y-2">
                        <KeyValue label="Status" value={message.ingestion_status ?? 'N/A'} />
                        <KeyValue label="Date & Time" value={formatDateTime(message.ingestion_date_time)} />
                    </div>

                    <div className="space-y-2">
                        <div className="text-black">
                            <span className="text-black/50 text-[16px]">CR: </span>
                            {message.change_request_id ? (
                                <Link
                                    href={`/${locale}/incoming-messages/change-request/${message.change_request_id}`}
                                    className="font-medium text-[14px] text-black break-all"
                                >
                                    {message.change_request_id}
                                    <Image
                                        src="/images/common/right_arrow.png"
                                        alt="Arrow"
                                        width={14}
                                        height={14}
                                        className="inline-block ml-1"
                                    />
                                </Link>
                            ) : (
                                <span className="font-semibold">N/A</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {openPopup && (
                <MessagePopup
                    onClose={() => setOpenPopup(false)}
                    rawJson={rawJson}
                    transformedJson={transformedJson}
                    enrichedJson={enrichedJson}
                    loading={loading}
                />
            )}
        </div>
    );
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-black">
            <span className="text-black/50 text-[16px]">{label}: </span>
            {/* <span className="text-black/50 mx-1">:</span> */}
            <span className="font-medium text-[14px]">{value}</span>
        </div>
    );
}
