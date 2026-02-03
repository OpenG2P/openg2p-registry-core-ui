'use client';
import { SectionBuilder } from '@openg2p/registry-widgets';
import type { SectionConfig } from '@openg2p/registry-widgets';

interface SectionDetailsConfigViewProps {
    sectionUISchema: any;
}

export default function SectionDetailsConfigView({
    sectionUISchema,
}: SectionDetailsConfigViewProps) {


    const handleSectionChange = (updatedSection: SectionConfig) => {
        console.log(updatedSection);
    };

    const handleSave = async (updatedSection: SectionConfig) => {
        console.log(updatedSection);
    };

    return (
        <div className="p-8 flex-1 flex flex-col min-h-0">
            <div className="bg-white rounded-[30px] p-8 h-full w-full flex flex-col overflow-y-auto">
                <SectionBuilder
                    initialSection={sectionUISchema}
                    onChange={handleSectionChange}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}
