'use client';

import Image from 'next/image';
import { IncomingMessage } from '@/features/messages/types';
import { useState } from 'react';
import MessagePopup from './MessagePopup';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface Props {
    message: IncomingMessage;
}

export default function IncomingMessageCard({ message }: Props) {
    const formatDateTime = (dt?: string | null) => dt ?? '-- -- ----';
    const [openPopup, setOpenPopup] = useState(false);
    const locale = useLocale();

    const demoRawJson = {
        "ingest_id": "ING-2026-000123",
        "partner": "Health Ministry",
        "data_model": "beneficiary_registration",
        "received_at": "2026-01-14T10:45:32Z",
        "payload": {
            "beneficiary": {
                "first_name": "Ravi",
                "last_name": "Kumar",
                "gender": "Male",
                "date_of_birth": "1994-08-21"
            },
            "address": {
                "village": "Rampur",
                "district": "Patna",
                "state": "Bihar",
                "country": "India"
            },
            "identifiers": [
                {
                    "type": "Aadhaar",
                    "value": "XXXX-XXXX-2345"
                }
            ]
        }
    }
    const demoTransformedJson = {
        "registry_id": "REG-889230",
        "target_register": "National Beneficiary Registry",
        "operation": "CREATE",
        "transformation_status": "SUCCESS",
        "transformed_at": "2026-01-14T10:45:41Z",
        "data": {
            "full_name": "Ravi Kumar",
            "gender": "M",
            "dob": "1994-08-21",
            "location": {
                "district_code": "BR-25",
                "state_code": "BR"
            },
            "external_ids": {
                "aadhaar_last4": "2345"
            }
        }
    }



    return (
        <div className="rounded-[30px] bg-white px-10 py-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-4 text-[16px] text-[#00000080]">
                <div className="space-y-2">
                    <h3 className="text-[16px] font-medium text-[#ED7C22] flex justify-between items-center">
                        <span>Raw</span>
                        <Image src="/chat.png" alt="Raw Icon" width={19} height={20} onClick={() => setOpenPopup(true)} />
                    </h3>
                    <KeyValue label="Ingest ID" value={message.ingest_id} />
                    <KeyValue label="Partner" value={message.partner} />
                    <KeyValue label="Data Model" value={message.data_model} />
                    <KeyValue label="Ingest Date & Time" value={message.ingest_datetime} />
                    <KeyValue label="Classification Status" value={message.classification_status} />
                    <KeyValue label="Classification Date & Time" value={formatDateTime(message.classification_datetime)} />
                </div>

                <div className="border-l-2 space-y-2 border-[#D9D9D9] pl-6">
                    <h3 className="text-[16px] font-medium text-[#ED7C22]">Classification</h3>
                    <KeyValue label="Target Register" value={message.target_register ?? '-- -- --'} />
                    <KeyValue label="Operation" value={message.operation ?? 'N/A'} />
                    <KeyValue label="Transformation Status" value={message.transformation_status ?? 'N/A'} />
                    <KeyValue label="Transformation Date & Time" value={formatDateTime(message.transformation_datetime)} />
                </div>

                <div className="border-l-2 space-y-2 border-[#D9D9D9] pl-6">
                    <h3 className="text-[16px] font-medium text-[#ED7C22] flex justify-between items-center">
                        <span>Transformation</span>
                        <Image src="/chat.png" alt="Raw Icon" width={19} height={20} onClick={() => setOpenPopup(true)} />
                    </h3>
                    <KeyValue label="Transformation Template" value={message.transformation_template ?? 'N/A'} />
                    <KeyValue label="Ingestion Status" value={message.ingestion_status ?? 'N/A'} />
                    <KeyValue label="Ingestion Date & Time" value={formatDateTime(message.ingestion_datetime)} />
                </div>

                <div className="border-l-2 space-y-2 border-[#D9D9D9] pl-6">
                    <h3 className="text-[16px] font-medium text-[#ED7C22]">Ingestion</h3>
                    <span className="text-black/50">Change Log ID</span>
                    <span className="text-black/50 mx-1">:</span>
                    {message.change_log_id ? (
                        <Link
                            href={`/${locale}/incoming-messages/change-request/${message.change_log_id}`}
                            className="font-semibold text-black inline-flex items-center gap-1"
                        >
                            {message.change_log_id}
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
                    rawJson={demoRawJson}
                    transformedJson={demoTransformedJson}
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
