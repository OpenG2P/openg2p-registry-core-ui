import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
	return proxyToBackend({
		req: request,
		targetEndpoint: "/register-metadata/edit_register_tab",
		buildPayload: (jsonBody) => ({
			pagination_request: {
				current_page: 1,
				page_size: 1,
				sort_by: "",
				filter_by: undefined,
				search_text: ""
			},
			request_payload: {
				tab_id: jsonBody.tab_id,
				register_id:jsonBody.register_id,
				tab_label: jsonBody.tab_label,
				tab_order: jsonBody.tab_order,
			},
		}),
	});
}
