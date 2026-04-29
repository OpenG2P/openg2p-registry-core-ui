import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useAllRegisterSectionsBrief } from '../shared/hooks/useAllRegisterSectionsBrief';




interface AddTabSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddTabSectionModal({ isOpen, onClose, onSuccess }: AddTabSectionModalProps) {
    const t = useTranslations();
    const { registerId, tabId } = useParams<{ registerId: string; tabId: string }>();
    const { config } = useRuntimeConfig();
    const { execute: createSection, loading } = useFetch();
    const { sections, loading: sectionLoading } = useAllRegisterSectionsBrief(registerId, 1, 100);

    const sectionOptions =
        sections?.map((sec: any) => ({
            label: sec.section_mnemonic,
            value: sec.section_id,
        })) || [];


    const [formData, setFormData] = useState({
        section_id: '',
        section_order: 0
    });


    const handleSubmit = async () => {
        if (!formData.section_id) {
            toast.warn('Section Id is required');
            return;
        }

        const result = await createSection('/api/configuration/registers/tab-metadata/add-section', {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                tab_id: tabId,
                section_id: formData.section_id,
                section_order: Number(formData.section_order) || 0,
            })
        });


        if (result?.tab_section_id) {
            toast.success('Section created successfully');
            setFormData({
                section_id: '',
                section_order: 0
            });

            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create section');
        }
    };

    const handleCancel = () => {
        setFormData({
            section_id: '',
            section_order: 0
        });

        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-neutral-first/80  z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-[95vh] bg-primary-first rounded-[10px] overflow-hidden flex p-1">

                <div className="flex-1 w-full bg-neutral-second p-10 relative rounded-[10px] overflow-y-auto">
                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-secondary-third hover:text-neutral-first/70 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-primary-second mb-4">{t('add_new_section')}</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-2">
                                {t('section')}
                            </label>

                            <select
                                value={formData.section_id}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        section_id: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none text-neutral-first/70"
                            >
                                <option value="">{t('select_section')}</option>

                                {sectionOptions.map((opt: any) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-2">
                                {t('section_order')}
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 0"
                                value={formData.section_order}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        section_order: Number(e.target.value) || 0
                                    }))
                                }
                                className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all text-neutral-first/70 placeholder:text-secondary-third"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleCancel}
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
