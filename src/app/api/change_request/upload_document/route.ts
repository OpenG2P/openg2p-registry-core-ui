import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
  UploadedDocument,
} from "@/shared/types";


export async function POST(request: NextRequest) {
  try {
    const { section_id, document_label_ids, files } = await request.json();

    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: {
        section_id,
        document_label_ids,
        files,
      },
    });

    const response = await fetch(`${BACKEND_CONFIG.apiUrl}/documents/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    const backendResponse: BackendResponse = await response.json();

    if (backendResponse.response_header.response_status === "ERROR") {
      return NextResponse.json(
        {
          error: backendResponse.response_header.response_error_message,
        },
        { status: 400 }
      );
    }

    const payload =
      backendResponse.response_body.response_payload as {
        uploaded_documents: UploadedDocument[];
      };

    const uploaded_documents = payload.uploaded_documents.map(
      ({ document_store_id, document_label_id }) => ({
        document_store_id,
        document_label_id,
      })
    );


    return NextResponse.json(uploaded_documents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
