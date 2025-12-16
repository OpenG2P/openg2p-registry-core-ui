/**
 * Dynamic translation loader
 * Supports loading translations from multiple sources:
 * 1. Built-in translations (bundled with app) - src/i18n/locales/*.json
 * 2. Runtime translations from public folder - public/locales/*.json
 * 3. Runtime translations from API - {API_URL}/locales/*.json
 * 
 * To add a new language WITHOUT code changes:
 * Option A: Copy translation file to public/locales/{langCode}.json
 * Option B: Provide via API endpoint {API_URL}/locales/{langCode}.json
 * 
 * To add a new language WITH minimal code changes (for built-in):
 * 1. Create src/i18n/locales/{langCode}.json
 * 2. Import it below
 * 3. Add it to builtInTranslations map
 */

// Import built-in translation files
// English is bundled with the app and always available as fallback
// Spanish is also bundled for immediate availability
// All other languages are loaded dynamically from public folder or API
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

// Map of language codes to their translation objects
// English and Spanish are bundled - all other languages loaded at runtime
const builtInTranslations: Record<string, any> = {
  en: enTranslations,
  es: esTranslations,
};

// Runtime-loaded translations (from API or public folder)
// These are loaded dynamically and can be updated without rebuilding
let runtimeTranslations: Record<string, any> = {};

// Combined translations (built-in + runtime, runtime takes precedence)
let translations: Record<string, any> = { ...builtInTranslations };

/**
 * Get all available language codes
 */
export function getAvailableLanguages(): string[] {
  return Object.keys(translations);
}

/**
 * Get translation object for a specific language
 */
export function getTranslations(lang: string): any {
  return translations[lang] || translations.en; // Fallback to English
}

/**
 * Get all translations as i18next resources format
 * With flat structure, translations are directly accessible by key
 */
export function getAllTranslations(): Record<string, { translation: any }> {
  const resources: Record<string, { translation: any }> = {};
  
  Object.keys(translations).forEach((lang) => {
    const translation = translations[lang];
    
    // All translations are stored in flat structure - no namespace transformation needed
    resources[lang] = {
      translation: translation, // Flat structure - direct key lookup (e.g., "common.addItem", "errors.required")
    };
  });
  
  return resources;
}

/**
 * Discover available languages from API or public folder
 * This allows adding languages dynamically without code changes
 * 
 * @param apiUrl - Optional API endpoint to discover languages
 *                 Should return list of available language codes or provide /locales/list.json
 * @param publicPath - Path in public folder (default: '/locales')
 * @returns Array of discovered language codes
 */
async function discoverAvailableLanguages(
  apiUrl?: string,
  publicPath: string = '/locales'
): Promise<string[]> {
  const discoveredLangs = new Set<string>(Object.keys(builtInTranslations));

  try {
    // Try to get language list from API
    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/locales/list.json`);
        if (response.ok) {
          const list = await response.json();
          if (Array.isArray(list)) {
            list.forEach((lang: string) => discoveredLangs.add(lang));
          }
        }
      } catch (e) {
        // Try to discover by attempting to load common language codes
        const commonLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi'];
        for (const lang of commonLangs) {
          try {
            const testResponse = await fetch(`${apiUrl}/locales/${lang}.json`, { method: 'HEAD' });
            if (testResponse.ok) {
              discoveredLangs.add(lang);
            }
          } catch (e) {
            // Ignore
          }
        }
      }
    }

    // Also check public folder for additional languages
    // Note: This is a best-effort discovery since we can't list files in public folder
    // You can create a public/locales/list.json file with available languages
    try {
      const publicListResponse = await fetch(`${publicPath}/list.json`);
      if (publicListResponse.ok) {
        const list = await publicListResponse.json();
        if (Array.isArray(list)) {
          list.forEach((lang: string) => discoveredLangs.add(lang));
        }
      }
    } catch (e) {
      // Ignore - list.json not required
    }
  } catch (error) {
    console.warn('Error discovering languages:', error);
  }

  return Array.from(discoveredLangs);
}

/**
 * Load translations from API or public folder at runtime
 * This allows adding languages without code changes
 * 
 * @param apiUrl - Optional API endpoint to fetch translations from
 *                 Format: {apiUrl}/locales/{langCode}.json
 * @param publicPath - Optional path in public folder (default: '/locales')
 * @param languageCodes - Optional array of language codes to load. If not provided, will discover them.
 */
export async function loadRuntimeTranslations(
  apiUrl?: string,
  publicPath: string = '/locales',
  languageCodes?: string[]
): Promise<void> {
  try {
    // Discover available languages if not provided
    const langsToLoad = languageCodes || await discoverAvailableLanguages(apiUrl, publicPath);
    const newTranslations: Record<string, any> = {};

    // Load translations for each discovered language
    for (const lang of langsToLoad) {
      // Skip English if it's built-in and we're not loading from API
      // (English is always available as built-in fallback)
      if (lang === 'en' && builtInTranslations[lang] && !apiUrl) {
        continue; // Use built-in English version
      }

      try {
        let translationData: any = null;

        // Try API endpoint first
        if (apiUrl) {
          try {
            const response = await fetch(`${apiUrl}/locales/${lang}.json`);
            if (response.ok) {
              translationData = await response.json();
            }
          } catch (e) {
            // Ignore - try public folder
          }
        }

        // Fallback to public folder
        if (!translationData) {
          try {
            const response = await fetch(`${publicPath}/${lang}.json`);
            if (response.ok) {
              translationData = await response.json();
            }
          } catch (e) {
            // Ignore - will use built-in English if lang is 'en', otherwise skip
          }
        }

        if (translationData) {
          newTranslations[lang] = translationData;
        }
      } catch (e) {
        console.warn(`Failed to load runtime translation for ${lang}:`, e);
      }
    }

    // Update runtime translations
    runtimeTranslations = newTranslations;
    
    // Merge with built-in translations (runtime takes precedence)
    translations = {
      ...builtInTranslations,
      ...runtimeTranslations,
    };
  } catch (error) {
    console.error('Error loading runtime translations:', error);
  }
}

/**
 * Get language metadata (name, flag, etc.)
 * This can be extended to load from a config file or API
 */
export function getLanguageMetadata(): Array<{ code: string; name: string; flag: string }> {
  // Language metadata - can be extended or loaded from API/config
  // Only English is guaranteed to be available (built-in)
  // Other languages are loaded dynamically
  const metadata: Record<string, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    it: { name: 'Italiano', flag: '🇮🇹' },
    pt: { name: 'Português', flag: '🇵🇹' },
    zh: { name: '中文', flag: '🇨🇳' },
    ja: { name: '日本語', flag: '🇯🇵' },
    ko: { name: '한국어', flag: '🇰🇷' },
    ar: { name: 'العربية', flag: '🇸🇦' },
    hi: { name: 'हिन्दी', flag: '🇮🇳' },
  };
  
  // Return metadata for all available languages
  // Languages are discovered dynamically from runtime sources
  return getAvailableLanguages()
    .map((code) => ({
      code,
      ...(metadata[code] || { name: code.toUpperCase(), flag: '🌐' }),
    }))
    .filter((lang) => translations[lang.code]); // Ensure translation exists
}
