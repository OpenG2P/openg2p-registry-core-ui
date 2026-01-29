"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useFetch } from "../shared/hooks/useFetch";

export interface RuntimeConfig {
    backendApiUrl: string;
    masterdataBackendApiUrl: string;
    appMnemonic: string;
    appUrl: string;
    partnerImportExportEnable: boolean;
    verifyServiceUrl: string;
    vpClientId: string;
    vpPresentationId: string;
    vpPurpose: string;
}

interface RuntimeConfigContextType {
    config: RuntimeConfig | null;
    loading: boolean;
    error: string | null;
}

const RuntimeConfigContext = createContext<RuntimeConfigContextType | undefined>(
    undefined
);

export function RuntimeConfigProvider({ children }: { children: ReactNode }) {
    const { data, loading, error } = useFetch<RuntimeConfig>({
        url: "/api/config",
    });

    return (
        <RuntimeConfigContext.Provider value={{ config: data, loading, error }}>
            {children}
        </RuntimeConfigContext.Provider>
    );
}

export function useRuntimeConfig() {
    const context = useContext(RuntimeConfigContext);
    if (context === undefined) {
        throw new Error(
            "useRuntimeConfig must be used within a RuntimeConfigProvider"
        );
    }
    return context;
}
