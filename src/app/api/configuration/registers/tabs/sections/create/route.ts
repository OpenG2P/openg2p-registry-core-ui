// "section_register_id": "string",
//       "register_id": "string",
//       "tab_id": "string",
//       "section_mnemonic": "string",
//       "section_description": "string",
//       "documents_required": false,
//       "no_of_verifications_required": 0,
//       "auto_approval": false,
//       "is_list": false,
//       "is_primary_section": false,
//       "section_ui_schema": {
//         "additionalProp1": {}
//       }

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
	return proxyToBackend({
		req: request,
		targetEndpoint: "/register-metadata/add_register_section",
		buildPayload: (jsonBody) => ({
			pagination_request: {
				current_page: 1,
				page_size: 1,
				sort_by: "",
				filter_by: undefined,
				search_text: ""
			},
			request_payload: {
				section_register_id: jsonBody.section_register_id,
				register_id: jsonBody.register_id,
				tab_id: jsonBody.tab_id,
				section_mnemonic: jsonBody.section_mnemonic,
				section_description: jsonBody.section_description,
				documents_required: jsonBody.documents_required,
				no_of_verifications_required: jsonBody.no_of_verifications_required,
				auto_approval: jsonBody.auto_approval,
				is_list: jsonBody.is_list,
				// is_primary_section: jsonBody.is_primary_section,
				section_ui_schema: jsonBody.section_ui_schema,
			},
		}),
	});
}
