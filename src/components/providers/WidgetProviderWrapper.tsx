"use client";

import { ReactNode } from 'react';
import { WidgetProvider, createWidgetStore } from '@openg2p/registry-widgets';
// Import translation loader
import { getAllTranslations } from '@/i18n/loadTranslations';


// Create the store once
const store = createWidgetStore();

// API adapter function for API data sources
const apiAdapter = async (url: string, options: any) => {
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API adapter error:', error);
    throw error;
  }
};

// Translations are now imported from separate JSON files
// See: src/i18n/locales/en.json and src/i18n/locales/es.json

// Get translations and log for debugging
const allTranslations = getAllTranslations();

// Debug: Log available languages and translation structure
console.log('🌐 i18n Translations Loaded:', {
  languages: Object.keys(allTranslations),
  resources: Object.keys(allTranslations).map(lang => ({
    lang,
    hasTranslation: !!allTranslations[lang]?.translation,
    translationKeys: allTranslations[lang]?.translation ? Object.keys(allTranslations[lang].translation).slice(0, 5) : [],
  })),
});

// i18n config with translations
const i18nConfig = {
  resources: allTranslations, // Loads all available languages
  lng: 'en', // Default language (can be changed dynamically)
  fallbackLng: 'en',
  debug: true, // Set to true for debugging translation issues - will log missing keys
  returnEmptyString: false, // Return key if translation not found
  returnNull: false,
  // The registry-widgets package uses flat translation keys
  // (e.g., "common.addItem", "errors.required") that are stored directly in the translation namespace
  interpolation: {
    escapeValue: false, // React already escapes values
  },
};

interface WidgetProviderWrapperProps {
  children: ReactNode;
}

/**
 * Client component wrapper for WidgetProvider
 * This component provides the widget context with i18n support
 * 
 * Note: This wrapper is necessary because layout.tsx is a server component,
 * but WidgetProvider must be in a client component.
 * 
 * The registry-widgets package now uses flat translation keys
 * (e.g., "common.addItem", "errors.required") directly, so no transformation is needed.
 */
export function WidgetProviderWrapper({ children }: WidgetProviderWrapperProps) {
  return (
    <WidgetProvider 
      store={store} 
      apiAdapter={apiAdapter} 
      i18nConfig={i18nConfig}
    >
      {children as any}
    </WidgetProvider>
  );
}
