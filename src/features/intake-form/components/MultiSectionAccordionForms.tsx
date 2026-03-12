import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionRenderer, WidgetProvider, createWidgetStore } from '@openg2p/registry-widgets';
import { dataSourceRequestHandler } from '@/features/register/utils/dataSourceRequestHandler';
import { IntakeFormSection } from '../types/intake-form';

export type SectionStatus = 'Saved' | 'Draft' | null;



export interface AccordionFormsProps {
  sections: IntakeFormSection[];
  schemaData?: any;
  onSubmit?: (sections: any) => void;
  onDraft?: (sections: any) => void;
  onCancel?: () => void;
}
export default function MultiSectionAccordionForms({
  sections,
  schemaData = {}
}: AccordionFormsProps) {
  const t = useTranslations();
  const widgetStore = useMemo(() => createWidgetStore(), []);

  const [openId, setOpenId] = useState<string | null>(sections[0]?.section_id || null);
  const toggleSection = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-4 mx-auto py-6">
      <WidgetProvider
        store={widgetStore}
        schemaData={schemaData}
        translate={t}
        dataSourceRequestHandler={dataSourceRequestHandler}
      >
        <div className="flex flex-col gap-4">
          {sections.map((section) => {
            const sectionId = section.section_id;
            const isOpen = openId === sectionId;

            return (
              <div
                key={sectionId}
                className="bg-white rounded-[10px] shadow-sm border border-[#0000000D] transition-all duration-200"
              >
                <div
                  className="flex items-center justify-between px-8 py-5 cursor-pointer select-none"
                  onClick={() => toggleSection(sectionId)}
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-[22px] font-semibold text-[#ED7C22]">
                      {section.section_mnemonic}
                    </h3>
                  </div>

                  {isOpen ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>

                {isOpen && (
                  <div className="px-8 pb-6">
                    <div className="min-h-25">
                      <SectionRenderer
                        section={section.section_ui_schema}
                        dbSectionId={section.section_id}
                        sectionRegisterId={section.section_register_id}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </WidgetProvider>
    </div>
  );
}
