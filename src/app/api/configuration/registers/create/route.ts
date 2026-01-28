import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/register-metadata/create_register",
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: 1,
                page_size: 1,
                sort_by: "",
                filter_by: undefined,
                search_text: ""
            },
            request_payload: {
                register_mnemonic: jsonBody.register_mnemonic,
                register_description: jsonBody.register_description,
                master_register_id: jsonBody.master_register_id,
                dedup_is_enabled: false,
                dedup_threshold_score: 0,
            },
        }),
    });
}

