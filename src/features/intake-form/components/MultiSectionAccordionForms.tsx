import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  SectionsContainer,
  WidgetProvider,
  createWidgetStore,
} from '@openg2p/registry-widgets';
import type { SectionChanges } from '@openg2p/registry-widgets';
import { dataSourceRequestHandler } from '@/features/register/utils/dataSourceRequestHandler';
import { IntakeFormSection } from '../types/intake-form';
import FormDetailsCard from './FormDetailsCard';

export type SectionStatus = 'Saved' | 'Draft' | null;

export interface AccordionFormsProps {
  formDetailsCard?: boolean;
  sections: IntakeFormSection[];
  form_name?: string;
  form_description?: string;
  schemaData?: any;
  onAction?: (sectionChanges?: SectionChanges, type?: 'submit' | 'draft', section?: IntakeFormSection) => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export default function MultiSectionAccordionForms({

  formDetailsCard = false,
  sections,
  form_name,
  form_description,
  schemaData = {},
  onAction,
  onCancel,
  showActions = true,
}: AccordionFormsProps) {

  const t = useTranslations();
  const widgetStore = useMemo(() => createWidgetStore(), []);

  const [formSubmit, setFormSubmit] = useState<(() => void) | null>(null);
  const [savedSections, setSavedSections] = useState<string[]>([]);

  useEffect(() => {
    if (schemaData) {
      const alreadySaved = sections
        .filter((s) => schemaData[s.section_register_id])
        .map((s) => s.section_id);
      setSavedSections((prev) => Array.from(new Set([...prev, ...alreadySaved])));
    }
  }, [schemaData, sections]);

  const allSectionsSaved = useMemo(() => {
    return sections.every(
      (section) =>
        savedSections.includes(section.section_id) ||
        !!schemaData[section.section_register_id]
    );
  }, [sections, savedSections, schemaData]);

  const sectionsConfig = useMemo(
    () =>
      sections.map((section) => ({
        ...section.section_ui_schema,
      })),
    [sections]
  );

  const intakeFormHeading = useMemo(() => form_name, [form_name]);
  const intakeFormDescription = useMemo(() => form_description, [form_description]);


  const handleDraft = useCallback(
    async (sectionChanges: SectionChanges) => {
      const section = sections.find((section) => section?.section_ui_schema?.['section-id'] === sectionChanges.section_id);
      if (section && !savedSections.includes(section.section_id)) {
        setSavedSections((prev) => [...prev, section.section_id]);
      }
      onAction?.(sectionChanges, 'draft', section);
    },
    [sections, onAction, savedSections]
  )

  const handleSubmit = async () => {
    if (formSubmit) {
      formSubmit();
    } else {
      onAction?.(undefined, 'submit');
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
                onSectionSave={handleDraft}
                onFormReady={(handle: any) => setFormSubmit(() => handle.submit)}
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
                    onClick={handleSubmit}
                    className="px-8 py-2.5 rounded-full bg-neutral-first text-neutral-second font-bold text-[14px]
                   disabled:bg-secondary-second disabled:text-secondary-third disabled:cursor-not-allowed"
                    disabled={formSubmit === null || !allSectionsSaved}
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

