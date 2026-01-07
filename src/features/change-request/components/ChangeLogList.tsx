'use client';

import { useRouter } from 'next/navigation';
import { ChangeRequest } from '@/features/change-request/types';
import { ChangeLogCard } from '@/features/change-request/components';

interface Props {
    logs: ChangeRequest[];
    getDetailsUrl: (log: ChangeRequest) => string;
}

export default function ChangeLogList({ logs, getDetailsUrl }: Props) {
    const router = useRouter();

    return (
        <div className="space-y-4">
            {logs.map(log => (
                <ChangeLogCard
                    key={log.change_request_id}
                    log={log}
                    onViewDetails={() => router.push(getDetailsUrl(log))}
                />
            ))}
        </div>
    );
}
