'use client';
import { SectionBuilder } from '@openg2p/registry-widgets';
import type { SectionConfig } from '@openg2p/registry-widgets';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

interface SectionDetailsConfigViewProps {
    sectionUISchema: any;
    registerId: string;
    sectionId: string;
}

export default function SectionDetailsConfigView({
    sectionUISchema,
    registerId,
    sectionId,
}: SectionDetailsConfigViewProps) {
    const { execute: updateUISchema, loading } = useFetch();

    const handleSectionChange = (updatedSection: SectionConfig) => {
        //If required then perform some action on UI schema onchange.
        console.log(updatedSection, "onChange Updated section");
    };

    const handleSave = async (updatedSection: SectionConfig) => {
        if (!registerId || !sectionId) {
            toast.error('Missing required section information');
            return;
        }

        const result = await updateUISchema('/api/configuration/registers/tabs/sections/update_uishema', {
            method: 'POST',
            body: JSON.stringify({
                section_id: sectionId,
                register_id: registerId,
                section_ui_schema: updatedSection,
            })
        });

        if (result?.section_id) {
            toast.success('Section UI schema updated successfully');
        } else {
            toast.error('Failed to update section UI schema');
        }
    };

    return (
        <div className='mx-8 mt-6 bg-white rounded-[10px] px-8 pb-8 pt-12 mb-6 overflow-x-visible'>
            <SectionBuilder
                initialSection={sectionUISchema}
                onChange={handleSectionChange}
                onSave={handleSave}
            />
        </div>

    );
}
