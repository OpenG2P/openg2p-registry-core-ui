import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/shared/utils';

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: '/register/get_verifications_for_change_request',
        buildPayload: (jsonBody) => {
            const paginationRequest = jsonBody?.request_body?.pagination_request ?? {};
            const requestPayload = jsonBody?.request_body?.request_payload ?? {};

            return {
                pagination_request: {
                    current_page: paginationRequest.current_page ?? 1,
                    page_size: paginationRequest.page_size ?? 10,
                    sort_by: paginationRequest.sort_by ?? '',
                    filter_by: paginationRequest.filter_by ?? '',
                    search_text: paginationRequest.search_text ?? '',
                },
                request_payload: {
                    change_request_id: requestPayload.change_request_id ?? '',
                },
            };
        },
        transformResponse: (responseBody) => ({
            verifications: responseBody.response_payload.verifications,
            pagination: responseBody.pagination_response,
        }),
    });
}
