import { NextRequest, NextResponse } from "next/server";
import {
    createBackendRequest,
    BACKEND_CONFIG,
    BackendResponse,
} from "@/shared/types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const backendRequest = createBackendRequest({
            pagination_request: body?.request_body?.pagination_request,
            request_payload: body?.request_body?.request_payload ?? {},
        });

        const backendUrl =
            `${BACKEND_CONFIG.apiUrl}/ingestion-data/get_enriched_and_transformed_payload`;

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(backendRequest),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend HTTP error ${response.status}` },
                { status: response.status }
            );
        }

        const backendResponse: BackendResponse = await response.json();

        if (backendResponse.response_header.response_status === "ERROR") {
            return NextResponse.json(
                {
                    error:
                        backendResponse.response_header
                            .response_error_message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(backendResponse);

    } catch (e) {
        return NextResponse.json(
            {
                error:
                    e instanceof Error
                        ? e.message
                        : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
