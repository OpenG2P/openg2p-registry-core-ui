import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function GET(req: NextRequest) {
    try {
        const [incomingRes, outgoingRes] = await Promise.all([
            proxyToBackend({
                req,
                targetEndpoint: "/ingestion-data/get_ingestion_summary_data",
                buildPayload: () => ({
                    pagination_request: {
                        current_page: 1,
                        page_size: 1,
                        sort_by: "",
                        search_text: "",
                    },
                    request_payload: {},
                }),
            }),
            // TODO: Once the outgoing summary api is ready replace the below endpoint
            proxyToBackend({
                req,
                targetEndpoint: "/ingestion-data/get_ingestion_summary_data",
                buildPayload: () => ({
                    pagination_request: {
                        current_page: 1,
                        page_size: 1,
                        sort_by: "",
                        search_text: "",
                    },
                    request_payload: {},
                }),
            }),
        ]);

        const incomingData = await incomingRes.json();
        const outgoingData = await outgoingRes.json();

        const incoming = incomingData?.no_of_messages ?? 0;
        // const outgoing = outgoingData?.no_of_messages ?? 0;
        const outgoing = 0;


        return NextResponse.json({
            total: incoming + outgoing,
            incoming,
            outgoing,
        });
    } catch (e) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}