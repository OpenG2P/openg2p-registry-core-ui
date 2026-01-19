import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";
import { UploadedDocument } from "@/shared";

export async function POST(request: NextRequest) {
  return proxyToBackend({
    req: request,
    targetEndpoint: "/documents/upload_documents",
    transformResponse: (responseBody) => {
      const payload = responseBody.response_payload || {};
      const uploadedDocuments = payload.uploaded_documents || [];
      return uploadedDocuments.map(
        ({ document_store_id, document_label }: UploadedDocument) => ({
          document_store_id,
          document_label,
        })
      );
    },
  });
}
