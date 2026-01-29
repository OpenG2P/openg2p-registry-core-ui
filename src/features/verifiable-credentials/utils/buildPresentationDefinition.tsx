export const buildPresentationDefinition = (descriptorSchema: any) => ({
    id: process.env.NEXT_PUBLIC_VP_PRESENTATION_ID!,
    purpose: process.env.NEXT_PUBLIC_VP_PURPOSE!,
    format: {
        ldp_vc: {
            proof_type: ['Ed25519Signature2020', 'EdDSA', 'ES256'],
        },
    },
    input_descriptors: [descriptorSchema],
});