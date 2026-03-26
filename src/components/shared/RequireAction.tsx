"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import Forbidden from "./Forbidden";
import { useRbac } from "@/context/RbacContext";
import { checkPermission } from "@/shared/utils/checkPermission";


interface RequireActionProps {
    action?: string;
    anyOf?: readonly string[];
    allOf?: readonly string[];
    children: ReactNode;
    redirectTo?: string;
    forbiddenFallback?: ReactNode;
}

export default function RequireAction({
    action,
    anyOf,
    allOf,
    children,
    redirectTo,
    forbiddenFallback = <Forbidden />,
}: RequireActionProps) {
    const router = useRouter();
    const { loading, can, canAny, canAll } = useRbac();

    const allowed = loading || checkPermission({ action, anyOf, allOf }, { can, canAny, canAll });

    useEffect(() => {
        if (!loading && !allowed && redirectTo) {
            router.replace(redirectTo);
        }
    }, [allowed, loading, redirectTo, router]);

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex items-center justify-center">
                <div className="w-9 h-9 border-4 border-[#E9BC19] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!allowed) {
        if (redirectTo) return null;
        return <>{forbiddenFallback}</>;
    }

    return <>{children}</>;
}