import "server-only";
import { getBackendConfig } from "./backend-config";
import { createBackendRequest } from "./backend-request";
import { requireAuthFromCookies } from "./requireAuth";



type ClientSafeConfigShape = {
    partnerImportExportEnable: boolean;
    verifyServiceUrl: string;
    vpClientId: string;
    partnerIngestUrl: string;
    pageSize: number;
    registryName: string;
    registryLogo: string;
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

                this.setMany({
                    registryName: payload?.registry_name ?? "",
                    registryLogo: payload?.registry_logo ?? "",
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
