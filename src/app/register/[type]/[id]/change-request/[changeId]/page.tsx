"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useFetch } from "@/shared/hooks/useFetch";
import { ChangeRequestDetailsView } from "@/features/change-request/components";

export default function RegisterChangeRequestDetailsPage() {
  const { type, id, changeId } = useParams<{
    type: string;
    id: string;
    changeId: string;
  }>();

  const { data: registers } = useFetch<any[]>({
    url: "/api/register/all",
  });

  const currentRegister = useMemo(
    () =>
      registers?.find(
        r => r.register_mnemonic.toLowerCase() === type.toLowerCase()
      ),
    [registers, type]
  );

  const breadcrumb = useMemo(
    () => [
      {
        label: currentRegister?.register_subject ?? "Register",
        href: `/register/${type}`,
      },
      { label: `ID-${id}`, href: `/register/${type}/${id}` },
      {
        label: "Change Request",
        href: `/register/${type}/${id}/change-request`,
      },
      { label: changeId },
    ],
    [type, id, changeId, currentRegister]
  );

  return (
    <ChangeRequestDetailsView
      changeId={changeId}
      breadcrumb={breadcrumb}
    />
  );
}
