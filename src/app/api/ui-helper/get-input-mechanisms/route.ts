import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/app/api/_lib/backend-proxy';

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: '/ui_helper/get_all_input_mechanisms',

        buildPayload: (body) => ({
            pagination_request: {
                current_page: 1,
                page_size: 100,
                sort_by: '',
                filter_by: undefined,
                search_text: '',
            },
            request_payload: {
                register_id: body.register_id,
            },
        }),

        transformResponse: (responseBody) =>
            responseBody.response_payload,
    });
}
