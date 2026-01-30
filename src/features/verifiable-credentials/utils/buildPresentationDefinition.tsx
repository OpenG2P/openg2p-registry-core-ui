import { getClientSafeConfig } from "@/app/api/_lib/client-safe-config";

export const buildPresentationDefinition = (descriptorSchema: any) => {
  const config = getClientSafeConfig();

  return {
    id: config.vpPresentationId!,
    purpose: config.vpPurpose!,
    format: {
      ldp_vc: {
        proof_type: ["Ed25519Signature2020", "EdDSA", "ES256"],
      },
    },
    input_descriptors: [descriptorSchema],
  };
};
