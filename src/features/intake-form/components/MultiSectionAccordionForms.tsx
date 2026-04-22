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
import FormDetailsCard from './FormDetailsCard';

export type SectionStatus = 'Saved' | 'Draft' | null;

export interface AccordionFormsProps {
  formDetailsCard?: boolean;
  sections: IntakeFormSection[];
  schemaData?: any;
  onAction?: (sectionChanges: SectionChanges[], type: 'submit' | 'draft') => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export default function MultiSectionAccordionForms({

  formDetailsCard = false,
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

  // NOTE: Intake form name and description contains
  // all the sections not global level
  // so here getting from first section
  const intakeFormHeading = useMemo(() => sections?.[0]?.intake_form_name, [sections]);
  const intakeFormDescription = useMemo(() => sections?.[0]?.intake_form_description, [sections]);



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
    <div className="mx-auto pt-0 pb-6 flex flex-col gap-4">
      {(intakeFormHeading || intakeFormDescription) && (
        <div className="pt-6 border-t-2 border-neutral-second mb-4">


          {intakeFormHeading && (
            <h3 className="text-[24px] font-medium leading-[100%] text-neutral-first mb-4">
              {intakeFormHeading}
            </h3>
          )}
          {intakeFormDescription && (
            <div className="text-secondary-third text-[16px] font-normal leading-[100%] flex flex-col gap-4 whitespace-pre-wrap pr-10">
              {intakeFormDescription}
            </div>
          )}
        </div>
      )}



      <div className="flex gap-10">
        <div className={`flex-1 flex flex-col gap-4 ${formDetailsCard ? 'max-w-[calc(100%-380px)]' : ''}`}>
          <WidgetProvider
            store={widgetStore}
            schemaData={schemaData}
            translate={t}
            dataSourceRequestHandler={dataSourceRequestHandler}
          >
            <div className="flex flex-col gap-1">

              <SectionsContainer
                sections={sectionsConfig}
                mode="IntakeForm"
                isDraft={showActions}
                onFormReady={setFormHandle}
              />

              {/* Action Buttons */}
              {showActions && (
                <div className="flex items-center justify-end gap-3 pt-2">

                  <button
                    onClick={handleCancel}
                    className="px-8 py-2.5 rounded-full bg-secondary-second text-neutral-first font-bold text-[14px] hover:bg-secondary-third transition-colors"
                  >
                    {t('cancel')}
                  </button>

                  <button
                    onClick={handleDraft}
                    className="px-8 py-2.5 rounded-full bg-neutral-first text-neutral-second font-bold text-[14px] hover:bg-secondary-second-800 transition-colors"
                  >
                    {t('save_draft')}
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-8 py-2.5 rounded-full bg-neutral-first text-neutral-second font-bold text-[14px]
                   disabled:bg-secondary-second disabled:text-secondary-third disabled:cursor-not-allowed"
                    disabled={formDetailsCard}
                  >
                    {t('submit')}
                  </button>

                </div>
              )}
            </div>
          </WidgetProvider>
        </div>

        {formDetailsCard && (
          <div className="shrink-0">
            <FormDetailsCard
              title={intakeFormHeading}
              description={intakeFormDescription}
            />

          </div>
        )}
      </div>
    </div>
  );
}

