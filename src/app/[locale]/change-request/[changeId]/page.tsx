"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ChangeRequestDetailsView } from "@/features/change-request/components";

export default function ChangeRequestDetailsPage() {
  const { changeId } = useParams<{
    changeId: string;
  }>();

  const breadcrumb = useMemo(
    () => [
      {
        label: "Change Request",
        href: `/change-request`,
      },
      { label: `Change ID - ${changeId}` },
    ],
    [changeId]
  );

  return (
    <ChangeRequestDetailsView
      changeId={changeId}
      breadcrumb={breadcrumb}
    />
  );
}
