import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
	return proxyToBackend({
		req: request,
		targetEndpoint: "/register-metadata/get_register_tab_sections",
		buildPayload: (jsonBody) => ({
			pagination_request: {
				current_page: jsonBody.page || 1,
				page_size: jsonBody.pageSize || 10,
				sort_by: "",
				filter_by: undefined,
				search_text: ""
			},
			request_payload: {
				register_id: jsonBody.register_id,
				tab_id: jsonBody.tab_id,
			},
		}),
		transformResponse: (responseBody) => ({
			sections: responseBody?.response_payload || [],
			pagination: responseBody?.pagination_response
		}),
	});
}

