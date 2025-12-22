import { NextRequest, NextResponse } from "next/server";
import type { UISchema } from "@openg2p/registry-widgets";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

/** Mock tab-wise UI schemas */
const TAB_SCHEMAS: Record<string, UISchema> = {
  "tab:farmer.details": {
    sections: [
      {
        "section-id": "section:farmer.personal",
        "section-title": "Personal Information",
        "section-editable": false,
        panels: [
          {
            "panel-id": "panel:farmer.personal.card",
            "panel-orientation": "vertical",
            widgets: [
              { "widget": "text", "widget-type": "input", "widget-label": "First Name", "widget-id": "first_name", "widget-data-path": "farmer.first_name", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Last Name", "widget-id": "last_name", "widget-data-path": "farmer.last_name", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Gender", "widget-id": "gender", "widget-data-path": "farmer.gender", "widget-readonly": true },
              { "widget": "number", "widget-type": "input", "widget-label": "Age", "widget-id": "age", "widget-data-path": "farmer.age", "widget-readonly": true },
            ],
          },
        ],
      },

      {
        "section-id": "section:farmer.contact",
        "section-title": "Contact Information",
        "section-editable": false,
        panels: [
          {
            "panel-id": "panel:farmer.contact.card",
            "panel-orientation": "vertical",
            widgets: [
              { "widget": "text", "widget-type": "input", "widget-label": "Mobile Number", "widget-id": "phone", "widget-data-path": "farmer.phone", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Email", "widget-id": "email", "widget-data-path": "farmer.email", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Village", "widget-id": "village", "widget-data-path": "farmer.village", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "District", "widget-id": "district", "widget-data-path": "farmer.district", "widget-readonly": true },
            ],
          },
        ],
      },

      {
        "section-id": "section:farmer.demographic",
        "section-title": "Demographic Information",
        "section-editable": false,
        panels: [
          {
            "panel-id": "panel:farmer.demographic.card",
            "panel-orientation": "vertical",
            widgets: [
              { "widget": "text", "widget-type": "input", "widget-label": "Category", "widget-id": "category", "widget-data-path": "farmer.category", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Education", "widget-id": "education", "widget-data-path": "farmer.education", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Occupation", "widget-id": "occupation", "widget-data-path": "farmer.occupation", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Marital Status", "widget-id": "marital_status", "widget-data-path": "farmer.marital_status", "widget-readonly": true },
            ],
          },
        ],
      },
    ],
  },

  "tab:crop.details": {
    sections: [
      {
        "section-id": "section:crop.basic",
        "section-title": "Crop Information",
        "section-editable": false,
        panels: [
          {
            "panel-id": "panel:crop.basic.card",
            "panel-orientation": "vertical",
            widgets: [
              { "widget": "text", "widget-type": "input", "widget-label": "Crop Name", "widget-id": "crop_name", "widget-data-path": "crops.name", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Season", "widget-id": "season", "widget-data-path": "crops.season", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Crop Type", "widget-id": "crop_type", "widget-data-path": "crops.type", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Variety", "widget-id": "variety", "widget-data-path": "crops.variety", "widget-readonly": true },
            ],
          },
        ],
      },

      {
        "section-id": "section:crop.land",
        "section-title": "Crop Land Details",
        "section-editable": false,
        panels: [
          {
            "panel-id": "panel:crop.land.card",
            "panel-orientation": "vertical",
            widgets: [
              { "widget": "number", "widget-type": "input", "widget-label": "Area (Acres)", "widget-id": "area", "widget-data-path": "crops.area", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Irrigation Type", "widget-id": "irrigation", "widget-data-path": "crops.irrigation", "widget-readonly": true },
              { "widget": "number", "widget-type": "input", "widget-label": "Expected Yield", "widget-id": "yield", "widget-data-path": "crops.yield", "widget-readonly": true },
              { "widget": "text", "widget-type": "input", "widget-label": "Sowing Method", "widget-id": "sowing_method", "widget-data-path": "crops.sowing_method", "widget-readonly": true },
            ],
          },
        ],
      },
    ],
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tab_id: string }> }
) {
  try {
    const { tab_id } = await params;

    /*
    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: { tab_id },
    });

    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_tab_schema`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    const backendResponse: BackendResponse = await response.json();

    if (backendResponse.response_header.response_status === "ERROR") {
      return NextResponse.json(
        { error: backendResponse.response_header.response_error_message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      backendResponse.response_body.response_payload
    );
    */

    /** Mock response */
    const schema = TAB_SCHEMAS[tab_id];

    if (!schema) {
      return NextResponse.json({ sections: [] }, { status: 404 });
    }

    return NextResponse.json(schema);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
