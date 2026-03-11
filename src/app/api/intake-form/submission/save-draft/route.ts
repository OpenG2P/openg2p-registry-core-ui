import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-data/save_submission_draft",
        buildPayload: (jsonBody) => ({
            pagination_request: undefined,
            request_payload: {
                submission_id: jsonBody.submission_id,
                register_id: jsonBody.register_id,
                tab_id: jsonBody.tab_id,
                foundational_id: jsonBody.foundational_id,
                link_foundational_id: jsonBody.link_foundational_id,
                no_of_verifications_required: jsonBody.no_of_verifications_required,
                section_payloads: jsonBody.section_payloads,
            },
        }),
    });
}

