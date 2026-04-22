import "server-only";
import { getBackendConfig } from "./backend-config";
import { createBackendRequest } from "./backend-request";
import { requireAuthFromCookies } from "./requireAuth";

type Branding = {
    color1?: string;
    color2?: string;
    color3?: string;
    color4?: string;
    color5?: string;
    color6?: string;
    color7?: string;
    font_url?: string;
    toast_color?: {
        toast_info_color?: string;
        toast_success_color?: string;
        toast_warning_color?: string;
        toast_failed_color?: string;
    }

};

type ClientSafeConfigShape = {
    partnerImportExportEnable: boolean;
    verifyServiceUrl: string;
    vpClientId: string;
    partnerIngestUrl: string;
    pageSize: number;
    registryName: string;
    registryLogo: string;
    branding?: Branding;
};

const defaultBranding: Branding = {
    color1: "#EABB13", // yellow
    color2: "#ED7C22", // orange
    color3: "#F3F1F4", //light gray
    color4: "#E1E1E1", // medium gray
    color5: "#A1A1A1", //dark gray
    color6: "#000000", // black
    color7: "#FFFFFF", // white
    toast_color: {
        toast_info_color: "#007BFF",// blue
        toast_success_color: "#28A745", //green
        toast_warning_color: "#FFC107",// yellow
        toast_failed_color: "#DC3545",//read
    }
};


class ClientSafeConfig {
    private config: ClientSafeConfigShape;

    constructor() {
        this.config = {
            partnerImportExportEnable: process.env.PARTNER_IMPORT_EXPORT_ENABLE === "true",
            verifyServiceUrl: process.env.VERIFY_SERVICE_URL ?? "",
            vpClientId: process.env.VP_CLIENT_ID ?? "",
            partnerIngestUrl: process.env.PARTNER_INGEST_URL ?? "",
            pageSize: parseInt(process.env.PAGE_SIZE ?? "10"),
            registryName: "",
            registryLogo: "",
            branding: { ...defaultBranding },
        };
    }

    async fetchRegistryConfig(origin: string): Promise<ClientSafeConfigShape> {
        const backendConfig = getBackendConfig();
        const backendUrl = `${backendConfig.backendApiUrl}/registry-config/get_registry_configuration`;

        try {
            const auth = await requireAuthFromCookies();
            if (!auth) return this.config;

            const backendRequest = createBackendRequest({ request_payload: {} }, origin);

            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    ...auth.backendHeaders,
                },
                body: JSON.stringify(backendRequest),
                next: {
                    revalidate: 0,
                    tags: ['registry-config']
                }
            });

            if (response.ok) {
                const data = await response.json();
                const payload = data.response_body?.response_payload;

                // Parse branding from backend response or environment variable
                let branding = { ...defaultBranding };

                if (payload?.branding) {
                    branding = { ...defaultBranding, ...payload.branding };
                }

                this.setMany({
                    registryName: payload?.registry_name ?? "",
                    registryLogo: payload?.registry_logo ?? "",
                    branding,
                });
            }
        } catch (error) {
            console.error("Failed to fetch registry config:", error);
        }
        return this.config;
    }

    getAll(): ClientSafeConfigShape {
        return this.config;
    }

    setMany(values: Partial<ClientSafeConfigShape>) {
        this.config = {
            ...this.config,
            ...values,
        };
    }
}

export const clientSafeConfig = new ClientSafeConfig();