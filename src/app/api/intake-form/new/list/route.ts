import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-metadata/get_intake_forms_for_register",
        buildPayload: (jsonBody) => ({
            pagination_request: {
                current_page: 1,
                page_size: 10,
                sort_by: jsonBody.sort_by ?? "",
                filter_by: jsonBody.filter_by ?? "",
                search_text: jsonBody.search_text ?? "",
            },
            request_payload: {
                register_id: jsonBody.register_id ?? "6428deca-575d-41f0-b022-a0d79f1495f4",
                tab_id: jsonBody.tab_id ?? "intake_form_tab_1",
            },
        }),
    });
}