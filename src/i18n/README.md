# Translation Files

This directory contains translation files for the application.

## Adding a New Language WITHOUT Code Changes

**Note**: Only English (en) is bundled with the app. All other languages (including Spanish) must be loaded dynamically.

### Option 1: Using Public Folder (Recommended for Backend Integration)

1. **Create translation file in public folder**: 
   - Copy an existing translation file (e.g., `src/i18n/locales/en.json`)
   - Save it as `public/locales/{langCode}.json`
   - Example: `public/locales/es.json` for Spanish, `public/locales/fr.json` for French

2. **Create language list file** (optional but recommended):
   - Create `public/locales/list.json` with available languages:
   ```json
   ["en", "es", "fr", "de"]
   ```
   - Note: Include "en" in the list even though it's built-in

3. **Restart the application**: The new language will automatically appear in the language selector.

### Option 2: Using API Endpoint

1. **Set environment variable**:
   ```bash
   NEXT_PUBLIC_I18N_API_URL=https://your-api.com
   ```

2. **Provide translations via API**:
   - API should serve translations at: `{API_URL}/locales/{langCode}.json`
   - Optionally provide language list at: `{API_URL}/locales/list.json`
   - Example: `https://your-api.com/locales/es.json` for Spanish

3. **Restart the application**: Languages from API will be loaded automatically.

## Adding a New Language WITH Code Changes (Built-in)

**Note**: Only English should be built-in. All other languages should use dynamic loading.

If you need to bundle additional languages (not recommended):

1. **Create translation file**: Copy `en.json` and save as `src/i18n/locales/{langCode}.json`
2. **Update loader**: 
   - Open `src/i18n/loadTranslations.ts`
   - Import: `import {langCode}Translations from './locales/{langCode}.json';`
   - Add to `builtInTranslations`: `{langCode}: {langCode}Translations,`

## File Structure

```
src/i18n/
├── locales/
│   ├── en.json          # English translations (built-in)
│   ├── es.json          # Spanish translations (built-in)
│   └── {langCode}.json  # Add more built-in languages here
├── loadTranslations.ts  # Dynamic translation loader
└── README.md           # This file

public/
└── locales/
    ├── list.json        # Optional: List of available languages
    └── {langCode}.json  # Runtime-loaded translations (no code changes needed)
```

## Translation File Format

Each translation file should follow this structure:

```json
{
  "sections": {},
  "fields": {},
  "placeholders": {},
  "help": {},
  "tooltips": {},
  "countries": {},
  "states": {},
  "cities": {},
  "widgets": {
    "common": {
      "addItem": "...",
      "remove": "...",
      ...
    },
    "labels": {
      "name": "...",
      "fullName": "...",
      ...
    },
    "errors": { ... },
    "validation": { ... }
  }
}
```

## How It Works

1. **Built-in translations**: Only English (`en`) is bundled with the app in `src/i18n/locales/en.json`
2. **Runtime translations**: All other languages in `public/locales/` or from API are loaded at runtime
3. **Priority**: Runtime translations override built-in translations if they exist
4. **Discovery**: The system automatically discovers languages from:
   - Built-in English translation (always available as fallback)
   - `public/locales/list.json` (if exists)
   - API endpoint `{API_URL}/locales/list.json` (if configured)
   - Attempts to load common language codes
5. **Fallback**: If a translation fails to load, English is used as fallback

## Backend Integration

To add languages from your backend:

1. **Copy translation files** to `public/locales/` directory
2. **Create `public/locales/list.json`** with the list of available languages
3. **No code changes required** - the system will automatically load them

Example `public/locales/list.json`:
```json
["en", "es", "fr", "de", "it", "pt"]
```
