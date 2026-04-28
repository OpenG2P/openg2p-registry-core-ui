'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TopBar } from '@/components/shared';
import LanguagesConfigView from '@/features/configuration/registry/components/LanguagesConfigView';
import { useLang } from '@/features/configuration/registry/hooks/useLang';

const LanguagesConfigurationPage = () => {
    const t = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { languages, setLanguages, languagesLoading, fetchLanguages } = useLang();

    return (
        <>
            <TopBar
                breadcrumb={[{ label: t('registry') }, { label: t('languages') }]}
                showFilters={false}
                showPagination={false}
                showAddNewButton={true}
                addNewButtonText={t('add_new_language')}
                onAddNewButton={() => setIsModalOpen(true)}
            />

            <LanguagesConfigView
                languages={languages}
                setLanguages={setLanguages}
                loading={languagesLoading}
                isModalOpen={isModalOpen}
                onCloseModal={() => setIsModalOpen(false)}
                refetch={fetchLanguages}
            />
        </>
    );
};

export default LanguagesConfigurationPage;