"use client";

import { ReactNode } from "react";
import { NotificationContextProvider, useNotificationContext } from "@/context/NotificationContext";
import { AuthProvider } from "@/context/Authcontext";

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider>
            <NotificationContextProvider>
                {children}
            </NotificationContextProvider>
        </AuthProvider>
    );
};

export const useNotification = useNotificationContext;
