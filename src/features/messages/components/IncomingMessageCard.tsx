'use client';

import Image from 'next/image';
import { IncomingMessage } from '@/features/messages/types';
import { useState } from 'react';
import MessagePopup from './MessagePopup';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useIncomingMessagePayload } from '../hooks';

interface Props {
    message: IncomingMessage;
}
export function formatDateTime(value?: string | null) {
    if (!value) return '-- -- ----';

    const safeValue = value.includes('Z') ? value : `${value}Z`;

    return new Date(safeValue).toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
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
        <div className="rounded-[30px] bg-white px-10 py-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-4 text-[16px] text-[#00000080]">
                <div className="space-y-2">
                    <h3 className="text-[16px] font-medium text-[#ED7C22] flex justify-between items-center">
                        <span>Raw</span>
                        <Image
                            src="/chat.png"
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
                    <KeyValue label="Ingest ID" value={message.ingest_id} />
                    <KeyValue label="Partner" value={message?.partner_mnemonic} />
                    <KeyValue label="Data Model" value={message?.data_model_mnemonic} />
                    <KeyValue label="Ingest Date & Time" value={formatDateTime(message.receipt_date_time)} />
                    <KeyValue label="Classification Status" value={message.classification_status} />
                    <KeyValue label="Classification Date & Time" value={formatDateTime(message.classification_date_time)} />
                </div>

                <div className="border-l-2 space-y-2 border-[#D9D9D9] pl-6">
                    <h3 className="text-[16px] font-medium text-[#ED7C22]">Classification</h3>
                    <KeyValue label="Target Register" value={message.register_mnemonic ?? '-- -- --'} />
                    {/* <KeyValue label="No.of Attempt" value={message.classification_number_of_attempts ?? 'N/A'} /> */}
                    <KeyValue label="Transformation Status" value={message.transformation_status ?? 'N/A'} />
                    <KeyValue label="Transformation Date & Time" value={formatDateTime(message.transformation_date_time)} />
                </div>

                <div className="border-l-2 space-y-2 border-[#D9D9D9] pl-6">
                    <h3 className="text-[16px] font-medium text-[#ED7C22] flex justify-between items-center">
                        <span>Transformation</span>
                        <Image
                            src="/chat.png"
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
                    <KeyValue label="Transformation Template" value={message.template_file_id ?? 'N/A'} />
                    <KeyValue label="Ingestion Status" value={message.ingestion_status ?? 'N/A'} />
                    <KeyValue label="Ingestion Date & Time" value={formatDateTime(message.ingestion_date_time)} />
                </div>

                <div className="border-l-2 space-y-2 border-[#D9D9D9] pl-6">
                    <h3 className="text-[16px] font-medium text-[#ED7C22]">Ingestion</h3>
                    <span className="text-black/50">Change Log ID</span>
                    <span className="text-black/50 mx-1">:</span>
                    {message.change_request_id ? (
                        <Link
                            href={`/${locale}/incoming-messages/change-request/${message.change_request_id}`}
                            className="font-semibold text-black inline-flex items-center gap-1"
                        >
                            {message.change_request_id}
                            <Image
                                src="/right_arrow.png"
                                alt="Arrow"
                                width={14}
                                height={14}
                                className="inline-block"
                            />
                        </Link>
                    ) : (
                        <span className="font-semibold">N/A</span>
                    )}
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
        <div className="text-black text-[16px]">
            <span className="text-black/50">{label}</span>
            <span className="text-black/50 mx-1">:</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}
