'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Palette, Trash2, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';
import ColorPicker from './ColorPicker';
import ImageCropper from '@/components/shared/ImageCropper';
import ConfirmRemovePopup from '@/features/configuration/shared/components/ConfirmRemovePopup';
import { Theme, COLOR_ATTRIBUTES, TYPOGRAPHY_ATTRIBUTES, IMAGE_ATTRIBUTES } from '../types';

interface ThemeColorEditorProps {
    selectedThemeId: string | null;
    selectedTheme: Theme | undefined;
    attributesLoading: boolean;
    previewColors: string[];
    getColor: (key: string) => string;
    onColorChange: (key: string, value: string) => void;
    onSave: () => void;
    onDiscard: () => void;
    onDelete: () => void;
    onReset: () => void;
    isFactoryTheme: boolean;
}

export default function ThemeColorEditor({
    selectedThemeId,
    selectedTheme,
    attributesLoading,
    previewColors,
    getColor,
    onColorChange,
    onSave,
    onDiscard,
    onDelete,
    onReset,
    isFactoryTheme,
}: ThemeColorEditorProps) {
    const t = useTranslations();
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [activeImageKey, setActiveImageKey] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppingImage(reader.result as string);
                setIsCropperOpen(true);
                setActiveImageKey(key);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        if (activeImageKey) {
            onColorChange(activeImageKey, croppedImage);
        }
        setIsCropperOpen(false);
        setCroppingImage(null);
        setActiveImageKey(null);
    };

    const handleCropCancel = () => {
        setIsCropperOpen(false);
        setCroppingImage(null);
        setActiveImageKey(null);
    };

    if (!selectedThemeId) {
        return (
            <div className="bg-neutral-second rounded-[10px] p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-secondary-first flex items-center justify-center">
                    <Palette size={28} className="text-secondary-third" strokeWidth={1.5} />
                </div>
                <p className="text-base font-medium text-neutral-first">{t('theme_config_select_to_edit')}</p>
                <p className="text-sm text-secondary-third">{t('theme_config_select_to_edit_desc')}</p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-second rounded-[10px] overflow-hidden">
            {/* Theme header */}
            <div className="px-6 py-5 border-b border-secondary-second flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-neutral-first m-0">{selectedTheme?.theme_mnemonic}</h2>
                    </div>
                </div>

                {selectedThemeId !== 'NEW' && (
                    <div className="flex items-center gap-3">
                        <button
                            id="reset-theme-btn"
                            onClick={onReset}
                            disabled={isFactoryTheme}
                            className="h-8.5 px-4 rounded-[10px] bg-neutral-first text-neutral-second text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {t("reset")}
                        </button>

                        <button
                            id="delete-theme-btn"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isFactoryTheme}
                            className="h-8.5 px-4 rounded-[10px] bg-neutral-first text-neutral-second text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {t("remove")}
                        </button>
                    </div>
                )}
            </div>

            {/* Color pickers */}
            {attributesLoading ? (
                <div className="p-6 flex flex-col gap-8">
                    <div>
                        <div className="h-6 w-32 bg-secondary-first rounded animate-pulse mb-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2].map(i => <div key={i} className="h-20 bg-secondary-first rounded-[10px] animate-pulse" />)}
                        </div>
                    </div>
                    <div>
                        <div className="h-6 w-32 bg-secondary-first rounded animate-pulse mb-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-secondary-first rounded-[10px] animate-pulse" />)}
                        </div>
                    </div>
                    <div>
                        <div className="h-6 w-32 bg-secondary-first rounded animate-pulse mb-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2].map(i => <div key={i} className="h-20 bg-secondary-first rounded-[10px] animate-pulse" />)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 flex flex-col gap-8">

                    {/* Minimal Theme Preview */}
                    <div className="rounded-[10px] overflow-hidden border border-secondary-second shadow-sm bg-neutral-second">
                        <div className="h-1.5 flex">
                            {previewColors.map((c, i) => (
                                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        <div className="px-5 py-3.5 flex items-center justify-between">
                            <span className="text-[14px] font-medium text-secondary-third">{t('theme_config_palette_preview')}</span>
                            <div className="flex gap-2">
                                {previewColors.map((c, i) => (
                                    <span
                                        key={i}
                                        className="w-6 h-6 rounded-full border border-neutral-second shadow-inner"
                                        style={{ backgroundColor: c }}
                                        title={COLOR_ATTRIBUTES[i]?.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Primary Colors */}
                    <div>
                        <h3 className="text-sm font-bold text-secondary-third uppercase tracking-wider mb-4 px-1">{t('theme_group_primary')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {COLOR_ATTRIBUTES.filter(a => a.key.startsWith('primary')).map(attr => (
                                <ColorPicker
                                    key={attr.key}
                                    id={`color-${attr.key}`}
                                    label={t(`theme_attr_${attr.key}_label`)}
                                    value={getColor(attr.key)}
                                    onChange={v => onColorChange(attr.key, v)}
                                    disabled={isFactoryTheme}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Secondary Colors */}
                    <div>
                        <h3 className="text-sm font-bold text-secondary-third uppercase tracking-wider mb-4 px-1">{t('theme_group_secondary')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {COLOR_ATTRIBUTES.filter(a => a.key.startsWith('secondary')).map(attr => (
                                <ColorPicker
                                    key={attr.key}
                                    id={`color-${attr.key}`}
                                    label={t(`theme_attr_${attr.key}_label`)}
                                    value={getColor(attr.key)}
                                    onChange={v => onColorChange(attr.key, v)}
                                    disabled={isFactoryTheme}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Neutral Colors */}
                    <div>
                        <h3 className="text-sm font-bold text-secondary-third uppercase tracking-wider mb-4 px-1">{t('theme_group_neutral')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {COLOR_ATTRIBUTES.filter(a => a.key.startsWith('neutral')).map(attr => (
                                <ColorPicker
                                    key={attr.key}
                                    id={`color-${attr.key}`}
                                    label={t(`theme_attr_${attr.key}_label`)}
                                    value={getColor(attr.key)}
                                    onChange={v => onColorChange(attr.key, v)}
                                    disabled={isFactoryTheme}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Typography Section */}
                    {/* <div>
                        <h3 className="text-sm font-bold text-secondary-third uppercase tracking-wider mb-4 px-1">{t('theme_group_typography')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {TYPOGRAPHY_ATTRIBUTES.map(attr => (
                                <div key={attr.key} className="flex flex-col gap-2">
                                    <span className="text-[13px] font-semibold text-neutral-first/80 px-1">{t(`theme_attr_${attr.key}_label`)}</span>
                                        <input
                                            type="text"
                                            value={getColor(attr.key)}
                                            onChange={e => onColorChange(attr.key, e.target.value)}
                                            placeholder={t(`theme_attr_${attr.key}_desc`)}
                                            disabled={isFactoryTheme}
                                            className="w-full h-10 px-4 rounded-[10px] border border-secondary-second text-[14px] font-medium text-neutral-first bg-secondary-first/30 outline-none focus:border-primary-first transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* Images Section */}
                    <div>
                        <h3 className="text-sm font-bold text-secondary-third uppercase tracking-wider mb-4 px-1">{t('theme_group_images')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {IMAGE_ATTRIBUTES.map(attr => {
                                const val = getColor(attr.key);
                                return (
                                    <div key={attr.key} className="flex flex-col gap-2">
                                        <span className="text-[13px] font-semibold text-neutral-first/80 px-1">{t(`theme_attr_${attr.key}_label`)}</span>
                                        <div className="relative group w-full h-48 bg-secondary-second rounded-[10px] flex items-center justify-center overflow-hidden shrink-0">
                                            <input
                                                type="file"
                                                id={`image-upload-${attr.key}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={e => handleFileChange(attr.key, e)}
                                                disabled={isFactoryTheme}
                                            />
                                            {val && val !== '/images/config/blank_image.png' ? (
                                                <Image
                                                    src={val}
                                                    alt={t(`theme_attr_${attr.key}_label`)}
                                                    width={300}
                                                    height={300}
                                                    className="object-contain"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-secondary-third">
                                                    <ImageIcon size={80} strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Overlay Action Buttons */}
                                            {!isFactoryTheme && (
                                                <div className="absolute inset-0 bg-neutral-first/40 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => document.getElementById(`image-upload-${attr.key}`)?.click()}
                                                        className="flex items-center justify-center gap-2 w-23.75 py-1.5 bg-neutral-second rounded-[10px] text-primary-second shadow-md hover:bg-secondary-first transition-all active:scale-95"
                                                    >
                                                        <Upload size={15} strokeWidth={2.5} />
                                                        <span className="text-[13px] leading-none">{t('upload')}</span>
                                                    </button>
                                                    {val && val !== '/images/config/blank_image.png' && (
                                                        <button
                                                            onClick={() => onColorChange(attr.key, '')}
                                                            className="flex items-center justify-center gap-2 w-23.75 py-1.5 bg-neutral-second rounded-[10px] text-primary-second shadow-md hover:bg-secondary-first transition-all active:scale-95"
                                                        >
                                                            <Trash2 size={15} strokeWidth={2.5} />
                                                            <span className="text-[13px] leading-none">{t('remove')}</span>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedThemeId !== 'NEW' && (
                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-secondary-second">
                            <button
                                id="discard-theme-btn"
                                onClick={onDiscard}
                                className="px-6 h-10 rounded-[10px] bg-secondary-second text-neutral-first/70 text-sm font-semibold hover:bg-secondary-third transition-colors"
                            >
                                {t('theme_config_discard')}
                            </button>
                            <button
                                id="save-theme-btn"
                                onClick={onSave}
                                disabled={isFactoryTheme}
                                className="px-6 h-10 rounded-[10px] bg-neutral-first text-neutral-second text-sm font-semibold hover:bg-neutral-first/90 transition-colors shadow-lg active:scale-95 transform transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {t('theme_config_save_changes')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isCropperOpen && croppingImage && (
                <ImageCropper
                    image={croppingImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmRemovePopup
                    messageKey="theme_config_remove_confirm_simple"
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={() => {
                        onDelete();
                        setShowDeleteConfirm(false);
                    }}
                />
            )}
        </div>
    );
}
