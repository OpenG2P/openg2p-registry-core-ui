import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionRenderer, WidgetProvider, createWidgetStore } from '@openg2p/registry-widgets';
import { dataSourceRequestHandler } from '@/features/register/utils/dataSourceRequestHandler';
import { IntakeFormSection } from '../types/intake-form';

export type SectionStatus = 'Saved' | 'Draft' | null;

export interface AccordionFormsProps {
  sections: IntakeFormSection[];
  schemaData?: any;
  onAction?: (values: any, type: 'submit' | 'draft') => void;
  onCancel?: () => void;
  showActions?: boolean;
}
export default function MultiSectionAccordionForms({
  sections,
  schemaData = {},
  onAction,
  onCancel,
  showActions = true,
}: AccordionFormsProps) {
  const t = useTranslations();
  const widgetStore = useMemo(() => createWidgetStore(), []);

  const [openId, setOpenId] = useState<string | null>(sections[0]?.section_id || null);

  const expandedIndex = useMemo(() =>
    sections.findIndex(s => s.section_id === openId),
    [sections, openId]
  );

  const handleDraft = () => {
    const values = (widgetStore.getState() as any).widget.values;
    onAction?.(values, 'draft');
  };

  const handleSubmit = () => {
    const values = (widgetStore.getState() as any).widget.values;
    onAction?.(values, 'submit');
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="flex flex-col gap-4 mx-auto py-6">
      <WidgetProvider
        store={widgetStore}
        schemaData={schemaData}
        translate={t}
        dataSourceRequestHandler={dataSourceRequestHandler}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {sections.map((section, index) => (
              <SectionRenderer
                key={section.section_id}
                section={section.section_ui_schema}
                dbSectionId={section.section_id}
                sectionRegisterId={section.section_register_id}
                mode="IntakeForm"
                sectionIndex={index}
                sectionCount={sections.length}
                expandedSectionIndex={expandedIndex === -1 ? null : expandedIndex}
                onExpandSection={(idx) => {
                  const clickedId = sections[idx].section_id;
                  setOpenId((prev) => (prev === clickedId ? null : clickedId));
                }}
                onPreviousSection={(idx) => {
                  if (idx > 0) setOpenId(sections[idx - 1].section_id);
                }}
                onSectionSaveSuccess={(idx) => {
                  if (idx < sections.length - 1) {
                    setOpenId(sections[idx + 1].section_id);
                  }
                }}
                onSectionSave={(changes) => {
                  console.log(`Section ${index} save triggered:`, changes);
                }}
                isDraft={showActions}
              />
            ))}
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#0000000D]">
              <button
                onClick={handleCancel}
                className="px-8 py-2.5 rounded-full bg-[#E1E1E1] text-[#717171] font-bold text-[14px] hover:bg-[#d4d4d4] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDraft}
                className="px-8 py-2.5 rounded-full bg-black text-white font-bold text-[14px] hover:bg-gray-800 transition-colors"
              >
                Save Draft
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-full bg-black text-white font-bold text-[14px] hover:bg-gray-800 shadow-sm transition-all active:scale-95"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </WidgetProvider>
    </div>
  );
}

