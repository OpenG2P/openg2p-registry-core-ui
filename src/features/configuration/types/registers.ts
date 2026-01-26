export interface Register {
    register_id: string;
    register_mnemonic: string;
    register_subject: string;
    register_description: string;
    master_register_id: string | null;
}