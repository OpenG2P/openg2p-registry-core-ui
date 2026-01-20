import { NextRequest, NextResponse } from "next/server";
import {
    createBackendRequest,
    BACKEND_CONFIG,
    BackendResponse,
    RequestBody,
} from "@/shared/types";

export type PayloadBuilder = (jsonBody: any) => RequestBody;
export type ResponseTransformer = (responseBody: any) => any;

interface BackendProxyOptions {
    req: NextRequest;
    targetEndpoint: string; // Backend API endpoint
    buildPayload?: PayloadBuilder;
    transformResponse?: ResponseTransformer; // Transforms backend response for client
    caching?: RequestInit; // this is used for Nextjs caching
    responseHeaders?: HeadersInit; // HTTP headers for client response or caching
}

export async function proxyToBackend({
    req,
    targetEndpoint,
    buildPayload,
    transformResponse,
    caching,
    responseHeaders
}: BackendProxyOptions) {
    try {
        const contentType = req.headers.get("content-type") || "";
        const isFormData = contentType.includes("multipart/form-data");

        let body: any = {};
        if (req.method !== 'GET') {
            if (isFormData) {
                body = await req.formData();
            } else {
                try {
                    body = await req.json();
                } catch (e) {
                    // ignore JSON parse error for empty body or if already read
                }
            }
        }

        const backendUrl = `${BACKEND_CONFIG.apiUrl}${targetEndpoint}`;
        const fetchOptions: RequestInit = {
            method: "POST",
            ...caching,
        };

        if (isFormData) {
            fetchOptions.body = body;
            // When sending FormData, the browser/runtime will automatically set
            // the Content-Type header with the correct boundary.
        } else {
            const defaultPayloadBuilder: PayloadBuilder = (b) => ({
                pagination_request: undefined,
                request_payload: b
            });

            const payload = (buildPayload || defaultPayloadBuilder)(body);
            
            const backendRequest = createBackendRequest(payload);

            fetchOptions.headers = {
                "Content-Type": "application/json"
            };
            fetchOptions.body = JSON.stringify(backendRequest);
        }

        const response = await fetch(backendUrl, fetchOptions);


        const backendResponse: BackendResponse = await response.json();

        if (backendResponse.response_header?.response_status === 'ERROR') {
            return NextResponse.json(
                { error: backendResponse.response_header.response_error_message },
                { status: 400, headers: responseHeaders }
            );
        }

        const responseBody = backendResponse.response_body;
        const data = transformResponse
            ? transformResponse(responseBody)
            : responseBody.response_payload;

        return NextResponse.json(data, { headers: responseHeaders });

    } catch (e) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
