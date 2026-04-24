import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { clientSafeConfig } from '@/app/api/_lib/client-safe-config';
import { getOrigin } from '@/app/api/_lib/get-origin';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    //load dynamic messages
    const origin = await getOrigin();
    await clientSafeConfig.fetchRegistryConfig(origin);
    const config = clientSafeConfig.getAll();
    
    let messages = {};
    if (config.language_config?.code === locale) {
        messages = config.language_config?.translation || {};
    } else {
        const dynamicLang = await clientSafeConfig.fetchLanguageConfigByCode(locale as string, origin);
        if (dynamicLang) {
            messages = dynamicLang.translation || {};
        }
    }


    if (Object.keys(messages).length > 0) {
        return {
            locale,
            messages
        };
    }

    try {
        const staticMessages = (await import(`../../locales/${locale}.json`)).default;
        messages = { ...staticMessages, ...messages };
    } catch (error) {
        // If static file is missing, we just stick with the DB translations
    }


    return {
        locale,
        messages
    };
});
