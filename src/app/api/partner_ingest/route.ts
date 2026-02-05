
import { NextRequest, NextResponse } from 'next/server';
import { clientSafeConfig } from '../_lib/client-safe-config';

export async function POST(req: NextRequest) {
    const partnerIngestUrl = clientSafeConfig.getAll().partnerIngestUrl;
    const body = await req.json();
    const { vc } = body;
    if (!partnerIngestUrl) {
        return NextResponse.json(
            { error: 'Partner ingest URL not configured' },
            { status: 500 }
        );
    }

    const response = await fetch(
        partnerIngestUrl,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify(vc),
        }
    );

    const result = await response.json();

    return NextResponse.json(result, { status: response.status });
}
