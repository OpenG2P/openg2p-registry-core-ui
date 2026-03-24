"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
    type ReactNode,
} from "react";

import { useAuth } from "@/context/Authcontext";

interface RbacContextType {
    loading: boolean;
    actions: string[];
    can: (action: string) => boolean;
    canAny: (actionList: readonly string[]) => boolean;
    canAll: (actionList: readonly string[]) => boolean;
    refresh: () => Promise<void>;
}

const RbacContext = createContext<RbacContextType | null>(null);

const HARDCODED_ACTIONS: string[] = [
    // "change_request.read",
    "intake_form.read",
    // "change_request.approve",
    // "change_request.reject",
    "verification.read",
    "verification.create"
];

export function RbacProvider({ children }: { children: ReactNode }) {
    const { isLoggedIn, handleUnauthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [actionSet, setActionSet] = useState<Set<string>>(new Set());

    const loadActions = useCallback(async () => {
        if (!isLoggedIn) {
            setActionSet(new Set());
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // const res = await fetch("/api/actions", { cache: "no-store" });

            // if (res.status === 401) {
            //     handleUnauthorized();
            //     return;
            // }

            // const data = await res.json();
            // setActionSet(new Set<string>(data.actions ?? []));
            setActionSet(new Set<string>(HARDCODED_ACTIONS));
        } catch (err) {
            console.error("Failed to load RBAC actions:", err);
            setActionSet(new Set());
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, handleUnauthorized]);

    useEffect(() => {
        loadActions();
    }, [loadActions]);

    const can = useCallback(
        (action: string) => actionSet.has(action),
        [actionSet]
    );

    const canAny = useCallback(
        (actionList: readonly string[]) => actionList.some((a) => actionSet.has(a)),
        [actionSet]
    );

    const canAll = useCallback(
        (actionList: readonly string[]) => actionList.every((a) => actionSet.has(a)),
        [actionSet]
    );

    const value = useMemo<RbacContextType>(
        () => ({
            loading,
            actions: Array.from(actionSet),
            can,
            canAny,
            canAll,
            refresh: loadActions,
        }),
        [loading, actionSet, can, canAny, canAll, loadActions]
    );

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#E9BC19] border-t-transparent rounded-full animate-spin" />
                    <p className="text-white text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <RbacContext.Provider value={value}>
            {children}
        </RbacContext.Provider>
    );
}

export function useRbac() {
    const context = useContext(RbacContext);
    if (!context) {
        throw new Error("useRbac must be used inside <RbacProvider>");
    }
    return context;
}