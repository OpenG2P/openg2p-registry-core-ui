import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/shared/utils';

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: '/register/add_verification_for_change_request',
        buildPayload: (jsonBody) => {
            const requestPayload = jsonBody?.request_body?.request_payload ?? {};

            return {
                pagination_request: {
                    current_page: 1,
                    page_size: 1,
                    sort_by: '',
                    filter_by: undefined,
                    search_text: '',
                },
                request_payload: {
                    change_request_id: requestPayload.change_request_id ?? '',
                    verification_observations: requestPayload.verification_observations ?? '',
                    is_approved: requestPayload.is_approved ?? false,
                },
            };
        },
        transformResponse: (responseBody) => ({
            verification: responseBody.response_payload,
        }),
    });
}
