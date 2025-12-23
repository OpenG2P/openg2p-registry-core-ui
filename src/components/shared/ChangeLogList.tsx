import { ChangeLog } from "@/shared/types/change-log";

interface Props {
    logs: ChangeLog[];
}

export default function ChangeLogList({ logs }: Props) {
    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <div
                    key={log.change_log_id}
                    className="border rounded-lg bg-white p-4"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold">
                            {log.approval_status}
                        </div>
                        <div className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="text-xs text-gray-600 mb-3">
                        Created by <span className="font-medium">{log.created_by}</span>
                    </div>

                    {/* Payload */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(log.change_payload).map(
                            ([key, value]) => (
                                <div key={key} className="flex gap-2">
                                    <span className="font-medium text-gray-700">
                                        {key}:
                                    </span>
                                    <span className="text-gray-600">
                                        {String(value)}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
