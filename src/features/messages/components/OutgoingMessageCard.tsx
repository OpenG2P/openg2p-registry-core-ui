'use client';

import Image from 'next/image';
import { useState } from 'react';
import { OutgoingMessage } from '../types';
import Link from 'next/link';

interface Props {
    message: OutgoingMessage;
}

export default function OutgoingMessageCard({ message }: Props) {
    const [showAllTopics, setShowAllTopics] = useState(false);

    const formatDateTime = (dt?: string) => dt ?? '-- -- ----';

    const topicsToShow = showAllTopics ? message.topic_names : message.topic_names.slice(0, 4);

    return (
        <div className="rounded-[30px] bg-white px-10 py-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 text-[16px] text-[#00000080]">

                <div className="space-y-2">
                    <h3 className="text-[16px] font-medium text-[#ED7C22] flex justify-between items-center">
                        <span>Source</span>
                        <Image
                            src="/chat.png"
                            alt="Raw Icon"
                            width={19}
                            height={20}
                            // onClick={() => setOpenPopup(true)}
                            className="cursor-pointer"
                        />
                    </h3>
                    <KeyValue label="Outgest ID" value={message.outgest_id} />
                    <KeyValue label="Queued Date & Time" value={formatDateTime(message.queued_datetime)} />
                    <KeyValue label="Source Register" value={message.source_register} />
                    <KeyValue label="Record ID" value={message.record_id} />
                    <KeyValue label="Source Change Log ID" value={message.source_change_log_id} />
                </div>

                <div className="border-l-2 border-[#D9D9D9] pl-6 flex flex-col justify-between">
                    <div className='space-y-2'>
                        <h3 className="text-[16px] font-medium text-[#ED7C22]">Topic Resolution Status</h3>
                        <KeyValue label="Topic Resolution" value={message.topic_resolution} />
                        <KeyValue label="Date & Time" value={formatDateTime(message.topic_resolution_datetime)} />
                    </div>
                    <div className='space-y-2'>
                        <h3 className="text-[16px] font-medium text-[#ED7C22]">Topics</h3>
                        <KeyValue label="Number of Topics Resolved" value={message.number_of_topics_resolved.toString()} />
                    </div>
                </div>


                <div className="border-l-2 border-[#D9D9D9] pl-6 space-y-2">
                    <h3 className="text-[16px] font-medium text-[#ED7C22]">Topic Names</h3>
                    {topicsToShow.map((topic, idx) => (
                        <KeyValue key={idx} label={`Topic ${idx + 1}`} value={topic} />
                    ))}
                    {message.topic_names.length > 4 && !showAllTopics && (
                        <Link
                            href={`/outgoing-messages}`}
                            className="text-black/50 inline-flex items-center gap-1"
                        >
                            {"View More"}
                            <Image
                                src="/right_arrow.png"
                                alt="Arrow"
                                width={14}
                                height={14}
                                className="inline-block"
                            />
                        </Link>
                    )}
                </div>
            </div>
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
