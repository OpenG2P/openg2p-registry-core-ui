import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SectionsContainer,
  WidgetProvider,
  createWidgetStore,
} from '@openg2p/registry-widgets';
import type { SectionsFormHandle, SectionChanges } from '@openg2p/registry-widgets';
import { dataSourceRequestHandler } from '@/features/register/utils/dataSourceRequestHandler';
import { IntakeFormSection } from '../types/intake-form';

export type SectionStatus = 'Saved' | 'Draft' | null;

export interface AccordionFormsProps {
  sections: IntakeFormSection[];
  schemaData?: any;
  onAction?: (sectionChanges: SectionChanges[], type: 'submit' | 'draft') => void;
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
  const [formHandle, setFormHandle] = useState<SectionsFormHandle | null>(null);

  const sectionsConfig = useMemo(
    () =>
      sections.map((section) => ({
        ...section.section_ui_schema,
      })),
    [sections]
  );

  const handleDraft = () => {
    if (!formHandle) return;
    // Get structured section data (records + files) without validation
    const sectionChanges = formHandle.getStructuredData();
    onAction?.(sectionChanges, 'draft');
  };

  const handleSubmit = async () => {
    if (!formHandle) return;
    try {
      // Validate all sections and get structured data (records + files)
      const sectionChanges = await formHandle.validateAndGetData();
      onAction?.(sectionChanges, 'submit');
    } catch (e) {
      console.error('Submission validation failed', e);
    }
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
          <SectionsContainer
            sections={sectionsConfig}
            mode="IntakeForm"
            isDraft={showActions}
            onFormReady={setFormHandle}
          />

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

