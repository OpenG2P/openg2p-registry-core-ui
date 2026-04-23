import "server-only";
import { getBackendConfig } from "./backend-config";
import { createBackendRequest } from "./backend-request";
import { requireAuthFromCookies } from "./requireAuth";

import { Branding, ClientSafeConfigShape, LanguageConfig } from "./client-safe-config.types";

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
            registry_theme_id: "",
            registry_language_id: "",
            branding: {},
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
                const rawPayload = data.response_body?.response_payload;
                const payload = Array.isArray(rawPayload) ? rawPayload[0] : rawPayload;
                const theme_id = payload?.registry_theme_id;

                let branding: Branding = {};

                if (theme_id) {
                    const themeUrl = `${backendConfig.backendApiUrl}/registry-theme/get_theme_values`;
                    const themeRequest = createBackendRequest({
                        request_payload: { theme_id: theme_id }
                    }, origin);

                    const themeResponse = await fetch(themeUrl, {
                        method: "POST",
                        headers: {
                            ...auth.backendHeaders,
                        },
                        body: JSON.stringify(themeRequest),
                        next: {
                            revalidate: 0,
                            tags: ['theme-config']
                        }
                    });

                    if (themeResponse.ok) {
                        const themeData = await themeResponse.json();
                        const attributes = themeData.response_body?.response_payload || [];

                        attributes.forEach((attr: { attribute_name: string; attribute_value: string }) => {
                            (branding as any)[attr.attribute_name] = attr.attribute_value;
                        });
                    }
                }

                const language_id = payload?.registry_language_id;
                let language_config: LanguageConfig | undefined = undefined;

                if (language_id) {
                    const languageUrl = `${backendConfig.backendApiUrl}/registry-language/get_language`;
                    const languageRequest = createBackendRequest({
                        request_payload: { language_id: language_id }
                    }, origin);

                    const languageResponse = await fetch(languageUrl, {
                        method: "POST",
                        headers: {
                            ...auth.backendHeaders,
                        },
                        body: JSON.stringify(languageRequest),
                        next: {
                            revalidate: 0,
                            tags: ['language-config']
                        }
                    });

                    if (languageResponse.ok) {
                        const languageData = await languageResponse.json();
                        language_config = languageData.response_body?.response_payload;
                    }
                }

                // If no specific language is configured or not found, fallback to the one marked as is_default
                if (!language_config) {
                    const allLanguagesUrl = `${backendConfig.backendApiUrl}/registry-language/get_all_languages`;
                    const allLanguagesRequest = createBackendRequest({
                        pagination_request: {
                            current_page: 1,
                            page_size: 100,
                            sort_by: "",
                            filter_by: undefined,
                            search_text: ""
                        },
                        request_payload: {}
                    }, origin);

                    const allLanguagesResponse = await fetch(allLanguagesUrl, {
                        method: "POST",
                        headers: {
                            ...auth.backendHeaders,
                        },
                        body: JSON.stringify(allLanguagesRequest),
                        next: {
                            revalidate: 0,
                            tags: ['all-languages-config']
                        }
                    });

                    if (allLanguagesResponse.ok) {
                        const allLanguagesData = await allLanguagesResponse.json();
                        const languages = allLanguagesData.response_body?.response_payload || [];
                        const defaultLang = languages.find((l: any) => l.is_default);
                        if (defaultLang) {
                            language_config = defaultLang;
                        }
                    }
                }

                this.setMany({
                    registryName: payload?.registry_name ?? "",
                    registryLogo: payload?.registry_logo ?? "",
                    registry_theme_id: theme_id ?? "",
                    registry_language_id: language_id ?? "",
                    branding,
                    language_config,
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