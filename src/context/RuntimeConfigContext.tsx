"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface RuntimeConfig {
    partnerImportExportEnable: boolean;
    verifyServiceUrl: string;
    vpClientId: string;
    vpPresentationId: string;
    vpPurpose: string;
    pageSize: number;
    partnerIngestUrl: string;
    registryName: string;
    registryLogo: string;
}



interface RuntimeConfigContextType {
    config: RuntimeConfig;
}

const RuntimeConfigContext = createContext<RuntimeConfigContextType | undefined>(
    undefined
);

export function RuntimeConfigProvider({
    children,
    initialConfig
}: {
    children: ReactNode;
    initialConfig: RuntimeConfig;
}) {
    return (
        <RuntimeConfigContext.Provider value={{ config: initialConfig }}>
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
