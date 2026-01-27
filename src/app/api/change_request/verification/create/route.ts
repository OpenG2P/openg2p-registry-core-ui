import { NextRequest } from 'next/server';
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: '/change-requests/add_verification_for_change_request',
        buildPayload: (body) => ({
            pagination_request: {
                current_page: 1,
                page_size: 1,
                sort_by: '',
                filter_by: undefined,
                search_text: '',
            },
            request_payload: {
                change_request_id: body.change_request_id ?? '',
                verification_observations: body.verification_observations ?? '',
                is_approved: body.is_approved ?? false,
            },
        }),
        transformResponse: (responseBody) => ({
            verification: responseBody.response_payload,
        }),
    });
}
