import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'es', 'fr', 'am', 'ar', 'pt', 'sw'],
    defaultLocale: 'en'
});
