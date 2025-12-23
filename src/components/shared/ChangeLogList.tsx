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
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg bg-white p-4"
                >
                    <div className="space-y-1">
                        <div className="text-sm font-semibold">
                            Change ID: {log.change_log_id}
                        </div>
                        <div className="text-sm">
                            Status:{" "}
                            <span className="font-medium">
                                {log.approval_status}
                            </span>
                        </div>
                        <div className="text-sm">
                            Change Date: {" "}
                            <span className="font-medium">
                                {new Date(log.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 text-sm">
                        <div>
                            Verification Required:{" "}
                            <span className="font-medium">
                                {log.verification.required}
                            </span>
                        </div>
                        <div>
                            Verification Done:{" "}
                            <span className="font-medium">
                                {log.verification.completed}
                            </span>
                        </div>
                        <div>
                            Docs Uploaded:{" "}
                            <span className="font-medium">
                                {log.documents.length}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 text-sm">
                        <div className="font-medium text-gray-700">
                            Documents
                        </div>

                        {log.documents.length === 0 && (
                            <div className="text-gray-400 text-xs">
                                No documents
                            </div>
                        )}

                        {log.documents.map((doc) => (
                            <div
                                key={doc.doc_id}
                                className="text-blue-600 cursor-pointer"
                            >
                                {doc.doc_name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
