"use client";

import { ReactNode } from "react";
import { ProfileContextProvider, useAuth as useProfileAuth } from "@/context/AuthContext";
import { NotificationContextProvider, useNotificationContext } from "@/context/NotificationContext";

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ProfileContextProvider>
            <NotificationContextProvider>
                {children}
            </NotificationContextProvider>
        </ProfileContextProvider>
    );
};

export const useAuth = useProfileAuth;
export const useNotification = useNotificationContext;