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
				register_id: jsonBody.register_id,
				tab_label: jsonBody?.tab_label ?? "",
				tab_order: jsonBody?.tab_order ?? 0,
				used_for_new_intake_form: jsonBody.used_for_new_intake_form,
				no_of_verifications_required: jsonBody?.no_of_verifications_required ?? 0,
				intake_form_name: jsonBody?.intake_form_name ?? "",
				intake_form_description: jsonBody?.intake_form_description ?? "",
				intake_form_auto_approve: jsonBody?.intake_form_auto_approve ?? false,
				is_active: jsonBody?.is_active ?? true
			},
		}),
	});
}
