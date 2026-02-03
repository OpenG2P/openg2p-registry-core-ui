import { Register, Tab, Section } from '../types';

export const getRegisterDetails = (id: string, registers: Register[]) => {
    const data = registers.find(r => r.register_id === id);
    return {
        register_id: id,
        register_mnemonic: id,
        register_description: '',
        ...data,
        mnemonic: data?.register_mnemonic || id,
        description: data?.register_description || '',
        parentRegisterId: data?.master_register_id || ''
    };
};

export const getTabDetails = (id: string, tabs: Tab[]) => {
    const data = tabs.find(t => t.tab_id === id);
    return {
        tab_id: id,
        tab_label: data?.tab_label || id,
        tab_order: data?.tab_order ?? 0,
        tab_name: data?.tab_label || id
    };
};

export const getSectionDetails = (id: string, sections: Section[]) => {
    const data = sections.find(s => s.section_id === id);
    return {
        section_id: id,
        ...data,
        description: data?.section_description || '',
        section_ui_schema: data?.section_ui_schema || {}
    };
};


export const getParentMnemonic = (parentId: string | null, registers: Register[]) => {
    if (!parentId) return 'None';
    const parent = registers.find((r) => r.register_id === parentId);
    return parent ? parent.register_mnemonic : 'None';
};
