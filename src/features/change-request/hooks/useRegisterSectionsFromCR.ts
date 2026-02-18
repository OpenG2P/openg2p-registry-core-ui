import { useFetch } from "@/shared/hooks/useFetch";

interface Params {
  sectionId?: string;
}

export const useRegisterSectionsFromCR = ({
  sectionId,
}: Params) => {
  // Fetch section (UI schema)
  const { data, loading: loadingSchema } = useFetch<any>({
    url: `/api/register/section-uischema`,
    enabled: !!sectionId,
    options: {
      method: "POST",
      body: JSON.stringify({
        section_id: sectionId,
      }),
    },
  });
  return {
    sectionUISchema: data?.section_ui_schema,
    loadingSchema: !!sectionId ? loadingSchema : false
  };
};
