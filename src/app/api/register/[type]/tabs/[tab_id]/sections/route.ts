import { NextRequest, NextResponse } from "next/server";
import type { UISchema } from "@openg2p/registry-widgets";

const TAB_SCHEMAS: Record<string, UISchema> = {
  "tab:farmer.profile": {
    sections: [
      {
        "section-id": "farmer-register-001",
        "section-title": "Basic Information",
        "section-editable": false,
        panels: [
          {
            "panel-id": "panel:farmer.basic",
            "panel-orientation": "horizontal",
            panels: [
              {
                "panel-id": "panel:farmer.basic.left",
                "panel-orientation": "vertical",
                widgets: [
                  {
                    "widget": "text",
                    "widget-type": "input",
                    "widget-label": "First Name",
                    "widget-id": "first_name",
                    "widget-data-path": "farmer-register-001.first_name",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-format": {
                      "characterType": "alphabetic",
                      "caseControl": "capitalize",
                      "showCharCounter": false
                    },
                    "widget-data-placeholder": "Enter first name",
                    "widget-data-helptext": "Your legal first name as per documents"
                  },
                  {
                    "widget": "text",
                    "widget-type": "input",
                    "widget-label": "Last Name",
                    "widget-id": "last_name",
                    "widget-data-path": "farmer-register-001.last_name",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-format": {
                      "characterType": "alphabetic",
                      "caseControl": "capitalize"
                    }
                  },
                  {
                    "widget": "text",
                    "widget-type": "input",
                    "widget-label": "National ID",
                    "widget-id": "national_id",
                    "widget-data-path": "farmer-register-001.national_id",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-format": {
                      "characterType": "alphanumeric",
                      "caseControl": "uppercase",
                      "mask": {
                        "pattern": "XXXX-XXXX-XXXX",
                        "type": "static",
                        "placeholder": "_"
                      }
                    },
                    "widget-data-placeholder": "XXXX-XXXX-XXXX"
                  }
                ]
              },
              {
                "panel-id": "panel:farmer.basic.right",
                "panel-orientation": "vertical",
                widgets: [
                  {
                    "widget": "radio",
                    "widget-type": "input",
                    "widget-label": "Gender",
                    "widget-id": "gender",
                    "widget-data-path": "farmer-register-001.gender",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "male", "label": "Male" },
                        { "value": "female", "label": "Female" },
                        { "value": "other", "label": "Other" }
                      ]
                    },
                    "widget-orientation": "horizontal"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "section-id": "farmer-crop-register-001",
        "section-title": "Current Crops",
        "section-editable": true,
        panels: [
          {
            "panel-id": "panel:farm.crops",
            "panel-orientation": "vertical",
            widgets: [
              {
                "widget": "simple-table",
                "widget-type": "table",
                "widget-label": "Crops Cultivated",
                "widget-id": "crops_table",
                "widget-data-path": "farmer-crop-register-001",
                "widget-readonly": true,
                "widget-data-columns": [
                  {
                    "column-key": "crop_name",
                    "widget-label": "Crop Name",
                    "widget": "text",
                    "widget-readonly": true,
                    "widget-data-path": "crop_name"
                  },
                  {
                    "column-key": "season",
                    "widget-label": "Season",
                    "widget": "text",
                    "widget-readonly": true,
                    "widget-data-path": "season"
                  },
                  {
                    "column-key": "area",
                    "widget-label": "Area (Acres)",
                    "widget": "number",
                    "widget-readonly": true,
                    "widget-data-path": "area"
                  },
                  {
                    "column-key": "expected_yield",
                    "widget-label": "Expected Yield (Quintals)",
                    "widget": "number",
                    "widget-readonly": true,
                    "widget-data-path": "expected_yield"
                  }
                ],
                "widget-data-operations": {
                  "add": true,
                  "remove": true,
                  "edit": true
                },
                "widget-data-add-label": "Add Crop"
              }
            ]
          }
        ]
      }
    ]
  },

  "tab:farm.details": {
    sections: [
      {
        "section-id": "farmer-farm-register-001",
        "section-title": "Land Information",
        "section-editable": true,
        panels: [
          {
            "panel-id": "panel:farm.land",
            "panel-orientation": "horizontal",
            panels: [
              {
                "panel-id": "panel:farm.land.left",
                "panel-orientation": "vertical",
                widgets: [
                  {
                    "widget": "number",
                    "widget-type": "input",
                    "widget-label": "Total Land Area (Acres)",
                    "widget-id": "total_land_area",
                    "widget-data-path": "farmer-farm-register-001.total_land_area",
                    "widget-required": true,
                    "widget-readonly": true,
                  },
                  {
                    "widget": "number",
                    "widget-type": "input",
                    "widget-label": "Cultivable Land (Acres)",
                    "widget-id": "cultivable_land",
                    "widget-data-path": "farmer-farm-register-001.cultivable_land",
                    "widget-required": true,
                    "widget-readonly": true,
                  },
                  {
                    "widget": "radio",
                    "widget-type": "input",
                    "widget-label": "Land Ownership",
                    "widget-id": "ownership",
                    "widget-data-path": "farmer-farm-register-001.land_ownership",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "owned", "label": "Owned" },
                        { "value": "leased", "label": "Leased" },
                        { "value": "shared", "label": "Shared" }
                      ]
                    },
                    "widget-orientation": "vertical"
                  }
                ]
              },
              {
                "panel-id": "panel:farm.land.right",
                "panel-orientation": "vertical",
                widgets: [
                  {
                    "widget": "select",
                    "widget-type": "input",
                    "widget-label": "Soil Type",
                    "widget-id": "soil_type",
                    "widget-data-path": "farmer-farm-register-001.soil_type",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "clay", "label": "Clay" },
                        { "value": "loam", "label": "Loam" },
                        { "value": "sandy", "label": "Sandy" },
                        { "value": "silt", "label": "Silt" },
                        { "value": "black", "label": "Black Soil" }
                      ]
                    }
                  },
                  {
                    "widget": "radio",
                    "widget-type": "input",
                    "widget-label": "Irrigation Source",
                    "widget-id": "irrigation_source",
                    "widget-data-path": "farmer-farm-register-001.irrigation_source",
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "borewell", "label": "Borewell" },
                        { "value": "canal", "label": "Canal" },
                        { "value": "river", "label": "River" },
                        { "value": "pond", "label": "Pond" },
                        { "value": "rainfed", "label": "Rainfed" }
                      ]
                    },
                    "widget-orientation": "vertical"
                  },
                  {
                    "widget": "file",
                    "widget-type": "input",
                    "widget-label": "Land Documents",
                    "widget-id": "land_docs",
                    "widget-data-path": "farmer-farm-register-001.land_documents",
                    "widget-readonly": true,
                    "widget-data-options": {
                      "accept": ".pdf,.jpg,.jpeg,.png",
                      "multiple": true,
                      "maxSize": 5242880
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "section-id": "section:farm.equipment",
        "section-title": "Farm Equipment",
        "section-editable": true,
        panels: [
          {
            "panel-id": "panel:farm.equipment",
            "panel-orientation": "vertical",
            widgets: [
              {
                "widget": "iterable-accordion",
                "widget-type": "group",
                "widget-label": "Equipment List",
                "widget-id": "equipment_list",
                "widget-data-path": "farmer-farm-register-001.equipment",
                "widget-readonly": true,
                "widget-data-collapsed": false,
                "widget-item": {
                  "widget": "text",
                  "widget-type": "input",
                  "widget-label": "Equipment Name",
                  "widget-id": "equipment_name",
                  "widget-data-path": "equipment_name",
                  "widget-readonly": true
                },
                "widget-data-operations": {
                  "add": true,
                  "remove": true,
                  "edit": true
                },
                "widget-data-add-label": "Add Equipment"
              }
            ]
          }
        ]
      }
    ]
  }
};

const TAB_REGISTER_MAP: Record<string, string> = {
  "tab:farmer.profile": "farmer-register-001",
  "tab:farm.details": "farmer-farm-register-001",
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tab_id: string }> }
) {
  const { tab_id } = await params;

  const uiSchema = TAB_SCHEMAS[tab_id];

  if (!uiSchema) {
    return NextResponse.json({ sections: [] });
  }

  const registerId = TAB_REGISTER_MAP[tab_id];

  if (!registerId) {
    return NextResponse.json(
      { error: "No register mapping found for tab" },
      { status: 400 }
    );
  }

  const sections = uiSchema.sections.map(uiSection => ({
    section_register_id: registerId,
    register_id: registerId,
    section_id: uiSection["section-id"],
    tab_id,
    section_mnemonic: uiSection["section-id"],
    section_description: uiSection["section-title"],
    documents_required: false,
    section_ui_schema: {
      sections: [uiSection],
    },
  }));

  return NextResponse.json({ sections });
}
