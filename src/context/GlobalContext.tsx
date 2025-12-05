"use client";

import { ReactNode } from "react";
import { ProfileContextProvider, useAuth as useProfileAuth } from "@/context/AuthContext";

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ProfileContextProvider>
            {children}
        </ProfileContextProvider>
    );
};

export const useAuth = useProfileAuth;