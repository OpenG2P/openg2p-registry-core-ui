'use client';

import { ChangeLog } from "@/features/change-request/types";

interface Props {
    log: ChangeLog;
    onViewDetails: () => void;
}

export default function ChangeLogCard({ log, onViewDetails }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg bg-white p-4">
            <div className="space-y-1">
                <div className="text-sm font-semibold">
                    Change ID: {log.change_request_id}
                </div>

                <div className="text-sm">
                    Status:{' '}
                    <span className="font-medium">{log.approval_status}</span>
                </div>

                <div className="text-sm">
                    Change Date:{' '}
                    <span className="font-medium">
                        {new Date(log.created_at).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="space-y-1 text-sm">
                <div>
                    Verification Required:{' '}
                    <span className="font-medium">{log.no_of_verifications_required}</span>
                </div>

                <div>
                    Verification Done:{' '}
                    <span className="font-medium">{log.no_of_verifications_done}</span>
                </div>

                {/* <div>
                    Docs Uploaded:{' '}
                    <span className="font-medium">{log.documents.length}</span>
                </div> */}
            </div>

            <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-700">Documents</div>

                {/* {log.documents.length === 0 ? (
                    <div className="text-gray-400 text-xs">No documents</div>
                ) : (
                    log.documents.map(doc => (
                        <div key={doc.doc_id} className="text-blue-600">
                            {doc.doc_name}
                        </div>
                    ))
                )} */}
            </div>

            <div>
                <button
                    onClick={onViewDetails}
                    className="text-sm text-blue-600 hover:underline"
                >
                    View details
                </button>
            </div>
        </div>
    );
}
