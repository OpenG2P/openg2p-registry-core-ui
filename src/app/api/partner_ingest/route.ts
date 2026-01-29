import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { vc } = body;

    const ingestUrl = process.env.PARTNER_INGEST_URL;

    if (!ingestUrl) {
        return NextResponse.json(
            { error: 'Partner ingest URL not configured' },
            { status: 500 }
        );
    }

    const response = await fetch(
        ingestUrl,
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
