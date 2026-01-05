import { NextRequest, NextResponse } from "next/server";
import type { UISchema } from "@openg2p/registry-widgets";

const TAB_SCHEMAS: Record<string, UISchema> = {
  "tab:farmer.profile": {
    sections: [
      {
        "section-id": "farmer-register-001",
        "section-title": "basicInformation",
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
                    "widget-label": "first_name",
                    "widget-id": "first_name",
                    "widget-data-path": "farmer-register-001.first_name",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-format": {
                      "characterType": "alphabetic",
                      "caseControl": "capitalize",
                      "showCharCounter": false
                    },
                    "widget-data-placeholder": "enter_first_name",
                    "widget-data-helptext": "legal_first_name_help"
                  },
                  {
                    "widget": "text",
                    "widget-type": "input",
                    "widget-label": "last_name",
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
                    "widget-label": "national_id",
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
                    "widget-label": "gender",
                    "widget-id": "gender",
                    "widget-data-path": "farmer-register-001.gender",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "male", "label": "male" },
                        { "value": "female", "label": "female" },
                        { "value": "other", "label": "other" }
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
        "section-title": "currentCrops",
        "section-editable": true,
        panels: [
          {
            "panel-id": "panel:farm.crops",
            "panel-orientation": "vertical",
            widgets: [
              {
                "widget": "simple-table",
                "widget-type": "table",
                "widget-label": "cropsCultivated",
                "widget-id": "crops_table",
                "widget-data-path": "farmer-crop-register-001",
                "widget-readonly": true,
                "widget-data-columns": [
                  {
                    "column-key": "crop_name",
                    "widget-label": "crop_name",
                    "widget": "text",
                    "widget-readonly": true,
                    "widget-data-path": "crop_name"
                  },
                  {
                    "column-key": "season",
                    "widget-label": "season",
                    "widget": "text",
                    "widget-readonly": true,
                    "widget-data-path": "season"
                  },
                  {
                    "column-key": "area",
                    "widget-label": "area_acres",
                    "widget": "number",
                    "widget-readonly": true,
                    "widget-data-path": "area"
                  },
                  {
                    "column-key": "expected_yield",
                    "widget-label": "expected_yield_quintals",
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
                "widget-data-add-label": "addCrop"
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
        "section-title": "landInformation",
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
                    "widget-label": "total_land_area_acres",
                    "widget-id": "total_land_area",
                    "widget-data-path": "farmer-farm-register-001.total_land_area",
                    "widget-required": true,
                    "widget-readonly": true,
                  },
                  {
                    "widget": "number",
                    "widget-type": "input",
                    "widget-label": "cultivable_land_acres",
                    "widget-id": "cultivable_land",
                    "widget-data-path": "farmer-farm-register-001.cultivable_land",
                    "widget-required": true,
                    "widget-readonly": true,
                  },
                  {
                    "widget": "radio",
                    "widget-type": "input",
                    "widget-label": "landOwnership",
                    "widget-id": "ownership",
                    "widget-data-path": "farmer-farm-register-001.land_ownership",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "owned", "label": "owned" },
                        { "value": "leased", "label": "leased" },
                        { "value": "shared", "label": "shared" }
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
                    "widget-label": "soilType",
                    "widget-id": "soil_type",
                    "widget-data-path": "farmer-farm-register-001.soil_type",
                    "widget-required": true,
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "clay", "label": "clay" },
                        { "value": "loam", "label": "loam" },
                        { "value": "sandy", "label": "sandy" },
                        { "value": "silt", "label": "silt" },
                        { "value": "black", "label": "black_soil" }
                      ]
                    }
                  },
                  {
                    "widget": "radio",
                    "widget-type": "input",
                    "widget-label": "irrigationSource",
                    "widget-id": "irrigation_source",
                    "widget-data-path": "farmer-farm-register-001.irrigation_source",
                    "widget-readonly": true,
                    "widget-data-source": {
                      "type": "static",
                      "options": [
                        { "value": "borewell", "label": "borewell" },
                        { "value": "canal", "label": "canal" },
                        { "value": "river", "label": "river" },
                        { "value": "pond", "label": "pond" },
                        { "value": "rainfed", "label": "rainfed" }
                      ]
                    },
                    "widget-orientation": "vertical"
                  },
                  {
                    "widget": "file",
                    "widget-type": "input",
                    "widget-label": "landDocuments",
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
        "section-title": "farmEquipment",
        "section-editable": true,
        panels: [
          {
            "panel-id": "panel:farm.equipment",
            "panel-orientation": "vertical",
            widgets: [
              {
                "widget": "iterable-accordion",
                "widget-type": "group",
                "widget-label": "equipmentList",
                "widget-id": "equipment_list",
                "widget-data-path": "farmer-farm-register-001.equipment",
                "widget-readonly": true,
                "widget-data-collapsed": false,
                "widget-item": {
                  "widget": "text",
                  "widget-type": "input",
                  "widget-label": "equipmentName",
                  "widget-id": "equipment_name",
                  "widget-data-path": "equipment_name",
                  "widget-readonly": true
                },
                "widget-data-operations": {
                  "add": true,
                  "remove": true,
                  "edit": true
                },
                "widget-data-add-label": "addEquipment"
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
