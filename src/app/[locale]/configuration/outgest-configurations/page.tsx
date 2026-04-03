import React from 'react'
import { useTranslations } from 'next-intl';

const page = () => {
    const t = useTranslations();
    return (
        <div className='text-center mt-10'>{t('outgest_configuration_page')}</div>
    )
}

export default page
