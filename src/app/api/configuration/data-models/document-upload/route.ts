import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";
import { UploadedDocument } from "@/shared";

// export async function POST(request: NextRequest) {
//     return proxyToBackend({
//         req: request,
//         targetEndpoint: "/documents/upload_documents",
//         transformResponse: (responseBody) => {
//             const payload = responseBody.response_payload || {};
//             const uploadedDocuments = payload.uploaded_documents || [];
//             return uploadedDocuments.map(
//                 ({ document_store_id, document_label }: UploadedDocument) => ({
//                     document_store_id,
//                     document_label,
//                 })
//             );
//         },
//     });
// }

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/documents/upload_documents",
        transformResponse: (responseBody) => {
            const payload = responseBody.response_payload || {};
            const uploadedDocuments = payload.uploaded_documents || [];

            const doc = uploadedDocuments[0]; // 👈 pick first file

            if (!doc) return null;

            return {
                file_id: doc.document_store_id,
                file_name: doc.document_label,
            };
        },
    });
}
