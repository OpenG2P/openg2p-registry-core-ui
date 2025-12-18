import { NextResponse } from "next/server";
import type { UISchema } from "@openg2p/registry-widgets";

const schema: UISchema = {
    "sections": [
        {
            "section-id": "personal-details",
            "section-title": "Personal Details",
            "section-editable": true,
            "panels": [
                {
                    "panel-id": "personal-details-card",
                    "panel-orientation": "horizontal",
                    "panels": [
                        {
                            "panel-id": "personal-left-column",
                            "panel-orientation": "vertical",
                            "widgets": [
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Name",
                                    "widget-id": "name",
                                    "widget-data-path": "person.name",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "number",
                                    "widget-type": "input",
                                    "widget-label": "ID",
                                    "widget-id": "id",
                                    "widget-data-path": "person.id",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "boolean",
                                    "widget-type": "input",
                                    "widget-label": "Is Married",
                                    "widget-id": "isMarried",
                                    "widget-data-path": "person.isMarried",
                                    "widget-required": false,
                                    "widget-readonly": true
                                }
                            ]
                        },
                        {
                            "panel-id": "personal-center-column",
                            "panel-orientation": "vertical",
                            "widgets": [
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Phone",
                                    "widget-id": "phone",
                                    "widget-data-path": "person.phone",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Mail ID",
                                    "widget-id": "email",
                                    "widget-data-path": "person.email",
                                    "widget-required": false,
                                    "widget-readonly": true
                                }
                            ]
                        },
                        {
                            "panel-id": "personal-right-column",
                            "panel-orientation": "vertical",
                            "widgets": [
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Village",
                                    "widget-id": "village",
                                    "widget-data-path": "address.village",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Zone",
                                    "widget-id": "zone",
                                    "widget-data-path": "address.zone",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Area",
                                    "widget-id": "area",
                                    "widget-data-path": "address.area",
                                    "widget-required": false,
                                    "widget-readonly": true
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "section-id": "other-details-1",
            "section-title": "Other Details",
            "section-editable": false,
            "panels": [
                {
                    "panel-id": "other-details-1-card",
                    "panel-orientation": "horizontal",
                    "panels": [
                        {
                            "panel-id": "other-details-1-panel",
                            "panel-orientation": "vertical",
                            "widgets": [
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Details",
                                    "widget-id": "details1",
                                    "widget-data-path": "other.details1",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Details",
                                    "widget-id": "details2",
                                    "widget-data-path": "other.details2",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Details",
                                    "widget-id": "details3",
                                    "widget-data-path": "other.details3",
                                    "widget-required": false,
                                    "widget-readonly": true
                                }
                            ]
                        },
                        {
                            "panel-id": "other-details-2-panel",
                            "panel-orientation": "vertical",
                            "widgets": [
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Details",
                                    "widget-id": "details4",
                                    "widget-data-path": "other.details4",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Details",
                                    "widget-id": "details5",
                                    "widget-data-path": "other.details5",
                                    "widget-required": false,
                                    "widget-readonly": true
                                },
                                {
                                    "widget": "text",
                                    "widget-type": "input",
                                    "widget-label": "Details",
                                    "widget-id": "details6",
                                    "widget-data-path": "other.details6",
                                    "widget-required": false,
                                    "widget-readonly": true
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "section-id": "other-details-2",
            "section-title": "Other Details 2",
            "section-editable": false,
            "panels": [
                {
                    "panel-id": "other-details-2-card",
                    "panel-orientation": "vertical",
                    "widgets": [
                        {
                            "widget": "text",
                            "widget-type": "input",
                            "widget-label": "Details",
                            "widget-id": "details7",
                            "widget-data-path": "other.details7",
                            "widget-required": false,
                            "widget-readonly": true
                        },
                        {
                            "widget": "text",
                            "widget-type": "input",
                            "widget-label": "Details",
                            "widget-id": "details8",
                            "widget-data-path": "other.details8",
                            "widget-required": false,
                            "widget-readonly": true
                        },
                        {
                            "widget": "text",
                            "widget-type": "input",
                            "widget-label": "Details",
                            "widget-id": "details9",
                            "widget-data-path": "other.details9",
                            "widget-required": false,
                            "widget-readonly": true
                        }
                    ]
                }
            ]
        }
    ]
};


export async function GET() {
    return NextResponse.json({
        pagination_response: null,
        response_payload: schema,
    });
}
