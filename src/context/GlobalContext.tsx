"use client";

import { ReactNode } from "react";
import { NotificationContextProvider, useNotificationContext } from "@/context/NotificationContext";

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    return (
            <NotificationContextProvider>
                {children}
            </NotificationContextProvider>
    );
};

export const useNotification = useNotificationContext;
