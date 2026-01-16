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
        label: "Incoming Messages",
        href: `/incoming-messages`,
      },
      {
        label: "Change Request",
        // href: `/change-request`,
      },
      { label: changeId },
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
