'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import type { ScoreContributingAttribute } from '../shared/types/registers';

interface EditScoreContributingAttributeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData: ScoreContributingAttribute | null;
}

function parseComputationJson(raw: string): Record<string, unknown> | null {
    const trimmed = raw.trim();
    if (!trimmed) return {};
    try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return null;
        }
        return parsed as Record<string, unknown>;
    } catch {
        return null;
    }
}

export default function EditScoreContributingAttributeModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}: EditScoreContributingAttributeModalProps) {
    const t = useTranslations();
    const { execute: updateAttr } = useFetch();

    const [attributeName, setAttributeName] = useState(() => initialData?.attribute_name ?? '');
    const [attributeWeight, setAttributeWeight] = useState(() =>
        String(initialData?.attribute_weight ?? 0),
    );
    const [computationRequired, setComputationRequired] = useState(
        () => initialData?.attribute_computation_required ?? false,
    );
    const [computationValueJson, setComputationValueJson] = useState(() =>
        JSON.stringify(initialData?.attribute_computation_value ?? {}, null, 2),
    );

    const handleSubmit = async () => {
        if (!initialData) return;
        if (!attributeName.trim()) {
            toast.warn(t('attribute_name_required'));
            return;
        }
        const value = parseComputationJson(computationValueJson);
        if (value === null) {
            toast.error(t('invalid_json_computation_value'));
            return;
        }
        const weight = Number(attributeWeight);
        if (Number.isNaN(weight)) {
            toast.warn(t('attribute_weight_invalid'));
            return;
        }

        const result = await updateAttr(
            '/api/configuration/registers/score/attribute/update-score-contributing-attributes',
            {
                method: 'POST',
                body: JSON.stringify({
                    contributing_attribute_id: initialData.contributing_attribute_id,
                    attribute_name: attributeName.trim(),
                    attribute_computation_required: computationRequired,
                    attribute_computation_value: value,
                    attribute_weight: weight,
                }),
            },
        );

        const updated = result as { contributing_attribute_id?: string; error?: string } | null;
        if (updated?.contributing_attribute_id && !updated.error) {
            toast.success(t('toast_contributing_attribute_updated'));
            onSuccess?.();
            onClose();
        } else {
            toast.error(t('toast_contributing_attribute_update_failed'));
        }
    };

    if (!isOpen || !initialData) return null;

    return (
        <div className="fixed inset-0 bg-neutral-first/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-[90vh] bg-primary-first rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-neutral-second relative rounded-[10px] overflow-y-auto p-10 max-h-[90vh]">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-secondary-third hover:text-neutral-first/70 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-primary-second mb-4">
                        {t('edit_contributing_attribute')}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-1">
                                {t('attribute_name')}
                            </label>
                            <input
                                type="text"
                                value={attributeName}
                                onChange={(e) => setAttributeName(e.target.value)}
                                className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all text-neutral-first/70"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-1">
                                {t('attribute_weight')}
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={attributeWeight}
                                onChange={(e) => setAttributeWeight(e.target.value)}
                                className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all text-neutral-first/70"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="edit_comp_req"
                                checked={computationRequired}
                                onChange={(e) => setComputationRequired(e.target.checked)}
                                className="h-4 w-4 rounded border-primary-second text-primary-second focus:ring-primary-second"
                            />
                            <label htmlFor="edit_comp_req" className="text-sm font-semibold text-neutral-first">
                                {t('attribute_computation_required')}
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-1">
                                {t('attribute_computation_value_json')}
                            </label>
                            <textarea
                                value={computationValueJson}
                                onChange={(e) => setComputationValueJson(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2 border border-primary-second rounded-lg font-mono text-sm outline-none outline-1 outline-primary-second text-neutral-first/70"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={onClose}
                                className="px-12 py-2.5 bg-secondary-third text-neutral-first rounded-[10px]"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-neutral-first text-neutral-second rounded-[10px]"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
