import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/app/api/_lib/backend-proxy';

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: '/ui_helper/get_all_input_mechanisms',
        buildPayload: body => body,
        transformResponse: res => res.response_payload,
    });
}
