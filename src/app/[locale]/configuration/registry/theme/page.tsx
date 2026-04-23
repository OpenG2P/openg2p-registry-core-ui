'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Palette, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from '@/i18n/navigation';
import { TopBar } from '@/components/shared';
import ThemeSelector from '@/features/configuration/registry/components/ThemeSelector';
import ThemeColorEditor from '@/features/configuration/registry/components/ThemeColorEditor';
import { useTheme } from '@/features/configuration/registry/hooks/useTheme';
import { COLOR_ATTRIBUTES } from '@/features/configuration/registry/types';

const ThemePage = () => {
    const {
        themes,
        themesLoading,
        selectedThemeId,
        attributesLoading,
        selectTheme,
        createTheme,
        updateThemeColors,
        removeTheme,
        getAttributeValue,
        loadAttributes,
    } = useTheme();

    const t = useTranslations();
    const router = useRouter();

    const [draftColors, setDraftColors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!themesLoading && themes.length > 0 && !selectedThemeId) {
            handleSelectTheme(themes[0].theme_id);
        }
    }, [themes, themesLoading, selectedThemeId]);

    const handleSelectTheme = async (themeId: string) => {
        await selectTheme(themeId);
        setDraftColors({});
    };


    const handleColorChange = (key: string, value: string) => {
        setDraftColors(prev => ({ ...prev, [key]: value }));
    };

    const getColor = (key: string): string =>
        key in draftColors ? draftColors[key] : getAttributeValue(key);

    const handleSave = async () => {
        if (!selectedThemeId) return;
        const updates = Object.entries(draftColors).map(([attribute_name, attribute_value]) => ({
            attribute_name,
            attribute_value,
        }));
        const result = await updateThemeColors(selectedThemeId, updates);
        if (result !== null) {
            toast.success(t('theme_config_update_success'));
            setDraftColors({});
        } else {
            toast.error(t('theme_config_update_error'));
        }
    };

    const handleResetToFactory = async () => {
        const factoryTheme = themes.find(t => t.is_factory_shipped);
        if (!factoryTheme || !selectedThemeId) return;

        try {
            const factoryAttrs = await loadAttributes(factoryTheme.theme_id);
            factoryAttrs.forEach(attr => {
                setDraftColors(prev => ({
                    ...prev,
                    [attr.attribute_name]: attr.attribute_value
                }));
            });
            toast.success(t('theme_config_reset_success'));
        } catch (error) {
            toast.error(t('theme_config_reset_error'));
        }
    };

    const handleDelete = async () => {
        if (!selectedThemeId) return;
        const result = await removeTheme(selectedThemeId);
        if (result !== null) {
            toast.success(t('theme_config_remove_success'));
        } else {
            toast.error(t('theme_config_remove_error'));
        }
    };

    const selectedTheme = themes.find(t => t.theme_id === selectedThemeId);
    const previewColors = COLOR_ATTRIBUTES.map(a => getColor(a.key));

    return (
        <>
            <TopBar
                breadcrumb={[{ label: t('registry') }, { label: t('registry_theme') }]}
                showFilters={false}
                showPagination={false}
                showAddNewButton={false}
            />

            <div className="mx-7.5 flex flex-col gap-5 pb-10">
                {/* Header card */}
                <div className="bg-neutral-second rounded-[10px] p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">

                            <div>
                                <h1 className="text-lg font-semibold text-neutral-first m-0">{t('theme_config_title')}</h1>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-secondary-second hidden md:block" />

                        <ThemeSelector
                            themes={themes}
                            themesLoading={themesLoading}
                            selectedThemeId={selectedThemeId}
                            onSelectTheme={handleSelectTheme}
                        />


                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            id="create-theme-btn"
                            onClick={() => router.push('/configuration/registry/theme/create')}
                            className="h-8.5 px-5 bg-primary-first rounded-[10px] flex items-center gap-2 hover:bg-primary-first/90 transition-colors"
                        >
                            <Plus size={15} strokeWidth={2.5} className="text-neutral-first" />
                            <span className="text-sm font-medium text-neutral-first">{t('theme_config_new_theme')}</span>
                        </button>
                    </div>
                </div>

                <ThemeColorEditor
                    selectedThemeId={selectedThemeId}
                    selectedTheme={selectedTheme}
                    attributesLoading={attributesLoading}
                    previewColors={previewColors}
                    getColor={getColor}
                    onColorChange={handleColorChange}
                    onSave={handleSave}
                    onDiscard={() => { setDraftColors({}); }}
                    onDelete={handleDelete}
                    onReset={handleResetToFactory}
                    isFactoryTheme={selectedTheme?.is_factory_shipped || false}
                />
            </div>
        </>
    );
};

export default ThemePage;