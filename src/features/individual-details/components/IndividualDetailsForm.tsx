"use client";

import React, { useState, useEffect } from 'react';
import { SectionRenderer } from '@openg2p/registry-widgets';
import uiSchema from '../schemas/UISchema.json';
import { useWidgetTranslation } from '@openg2p/registry-widgets';
import { getLanguageMetadata } from '@/i18n/loadTranslations';

/**
 * Language selector component
 * Uses the i18n instance from the WidgetProvider context via useWidgetTranslation
 */
function LanguageSelector() {
  const { i18n, getLanguage, changeLanguage } = useWidgetTranslation();
  const [currentLang, setCurrentLang] = useState<string>(getLanguage());

  useEffect(() => {
    // Set initial language
    setCurrentLang(getLanguage());

    // Listen for language changes from the i18n instance
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };

    if (i18n) {
      i18n.on('languageChanged', handleLanguageChanged);
    }

    return () => {
      if (i18n) {
        i18n.off('languageChanged', handleLanguageChanged);
      }
    };
  }, [i18n, getLanguage]);

  const handleLanguageChange = async (lng: string) => {
    try {
      await changeLanguage(lng);
      setCurrentLang(lng);
    } catch (err) {
      console.error('Error changing language:', err);
    }
  };

  // Dynamically get available languages from translation files
  // Languages are automatically discovered from src/i18n/locales/*.json files
  const languages = getLanguageMetadata();

  return (
    <div className="flex justify-end w-full">
      <div className="inline-flex items-center gap-2 bg-white rounded-lg shadow-md border-2 border-gray-300 p-3">
        <span className="text-sm font-medium text-gray-700">Language:</span>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                currentLang === lang.code
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
              }`}
              title={lang.name}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Component that renders the individual details form using the UISchema
 * Supports both English (en) and Spanish (es) languages
 * Language can be changed using the language selector at the top
 */
export function IndividualDetailsForm() {
  // Optional: Provide schema reference data for schema data sources
  const schemaData = {
    reference: {
      villages: [
        { code: 'v1', name: 'Village 1' },
        { code: 'v2', name: 'Village 2' },
        { code: 'v3', name: 'Village 3' },
      ],
    },
  };

  return (
    <div className="w-full">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <LanguageSelector />
      </div>
      <div className="w-full space-y-8" >
        {uiSchema.sections.map((section: any) => (
          <div key={section['section-id']} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <SectionRenderer
              section={section}
              schemaData={schemaData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
