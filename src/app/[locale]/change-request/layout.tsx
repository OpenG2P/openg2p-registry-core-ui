import RequireAction from "@/components/shared/RequireAction";
import { CHANGE_REQUEST_GROUPS } from "@/features/change-request/utils/changeRequest.actions";

export default function ChangeRequestLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAction anyOf={CHANGE_REQUEST_GROUPS.canAccess}>
            {children}
        </RequireAction>
    );
}