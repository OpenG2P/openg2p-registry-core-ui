import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: "/register-data/get_changes_for_a_date",
        buildPayload: (body) => ({
            request_payload: {
                register_id: body.register_id,
                internal_record_id: body.internal_record_id,
                tab_id: body.tab_id,
                truncated_created_date: body.truncated_created_date,
            },
        }),
        transformResponse: (responseBody) => ({
            changes:
                responseBody?.response_payload?.changes ?? [],
        }),
    });
}
