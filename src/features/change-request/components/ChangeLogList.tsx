'use client';

import { useRouter } from 'next/navigation';
import { ChangeLog } from '@/features/change-request/types';
import { ChangeLogCard } from '@/features/change-request/components';

interface Props {
    logs: ChangeLog[];
    getDetailsUrl: (log: ChangeLog) => string;
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
