'use client';

import { useState, useRef } from 'react';
import { X, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAllRegister } from '../shared/hooks/useAllRegister';
import { useFetch } from '@/shared/hooks';

import { toast } from 'react-toastify';
import { Register } from '../shared/types';
import { convertImageToBase64 } from '../shared/utils/convertImageToBase64';


interface AddRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddRegisterModal({ isOpen, onClose, onSuccess }: AddRegisterModalProps) {
    const t = useTranslations();
    const { registers } = useAllRegister(1, 100);
    const { execute: createRegister, loading: creating } = useFetch();
    const fileInputRef = useRef<HTMLInputElement>(null);



    const [formData, setFormData] = useState({
        register_mnemonic: '',
        register_description: '',
        master_register_id: '',
        dedup_is_enabled: false,
        dedup_threshold_score: '',
        register_icon: '',
        register_rank: '',
        register_purpose: 'REGISTER',
        functional_id_generation_required: false,
        completion_score_required: false,
    });


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size must be less than 2MB');
                return;
            }

            try {
                const base64 = await convertImageToBase64(file);
                setFormData(prev => ({ ...prev, register_icon: base64 }));
            } catch (error) {
                toast.error('Failed to process image');
            }
        }
    };



    const handleSubmit = async () => {
        if (!formData.register_mnemonic || !formData.register_description || !formData.register_purpose) {
            toast.warn('Basic fields (Mnemonic, Description, Purpose) are required');
            return;
        }

        const result = await createRegister('/api/configuration/registers/create', {
            method: 'POST',
            body: JSON.stringify({
                register_mnemonic: formData.register_mnemonic,
                register_description: formData.register_description,
                master_register_id: formData.master_register_id || null,
                dedup_is_enabled: formData.dedup_is_enabled,
                dedup_threshold_score: Number(formData.dedup_threshold_score) || 0,
                register_icon: formData.register_icon,
                register_rank: Number(formData.register_rank) || 0,
                register_purpose: formData.register_purpose,
                functional_id_generation_required: formData.functional_id_generation_required,
                completion_score_required: formData.completion_score_required,
            })
        });


        if (result?.register_id) {
            toast.success(`Register "${result.register_mnemonic}" created successfully`);

            // Reset form
            setFormData({
                register_mnemonic: '',
                register_description: '',
                master_register_id: '',
                dedup_is_enabled: false,
                dedup_threshold_score: '',
                register_icon: '',
                register_rank: '',
                register_purpose: 'REGISTER',
                functional_id_generation_required: false,
                completion_score_required: false,
            });


            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create register');
        }
    };

    const handleCancel = () => {
        setFormData({
            register_mnemonic: '',
            register_description: '',
            master_register_id: '',
            dedup_is_enabled: false,
            dedup_threshold_score: '',
            register_icon: '',
            register_rank: '',
            register_purpose: 'REGISTER',
            functional_id_generation_required: false,
            completion_score_required: false,
        });

        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-neutral-first/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-200 max-h-[95vh] bg-primary-first rounded-[10px] overflow-hidden flex p-1">
                <div className="flex-1 w-full bg-neutral-second relative rounded-[10px] p-10 overflow-y-auto">

                    <button
                        onClick={handleCancel}
                        className="absolute top-6 right-6 text-secondary-third hover:text-neutral-first/70 transition-colors"
                    >
                        <X size={40} strokeWidth={2} />
                    </button>

                    <h2 className="text-2xl font-bold text-primary-second mb-4">{t('add_new_register')}</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-2">
                                {t('register_mnemonic')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('enter_register_name')}
                                value={formData.register_mnemonic}
                                onChange={(e) => setFormData({ ...formData, register_mnemonic: e.target.value })}
                                className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all text-neutral-first/70 placeholder:text-secondary-third"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-first mb-2">
                                {t('register_description')}
                            </label>
                            <textarea
                                placeholder={t('type_your_message')}
                                value={formData.register_description}
                                onChange={(e) => setFormData({ ...formData, register_description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all resize-none text-neutral-first/70 placeholder:text-secondary-third"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('register_purpose')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.register_purpose}
                                        onChange={(e) => setFormData({ ...formData, register_purpose: e.target.value })}
                                        className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all bg-neutral-second appearance-none cursor-pointer text-neutral-first/70 pr-10"
                                    >
                                        <option value="REGISTER">REGISTER</option>
                                        <option value="PROGRAM_APPLICATION">PROGRAM_APPLICATION</option>
                                        <option value="TABLE">TABLE</option>
                                        <option value="TABLE">CORE_TABLE</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-third pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('master_register')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.master_register_id}
                                        onChange={(e) => setFormData({ ...formData, master_register_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all bg-neutral-second appearance-none cursor-pointer text-neutral-first/70"
                                    >
                                        <option value="">{t('select_master_register')}</option>
                                        {registers.map((register: Register) => (
                                            <option key={register.register_id} value={register.register_id}>
                                                {register.register_mnemonic}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-third pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>



                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('deduplication_enabled')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.dedup_is_enabled ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, dedup_is_enabled: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all bg-neutral-second appearance-none cursor-pointer text-neutral-first/70 pr-10"
                                    >
                                        <option value="true">{t('true')}</option>
                                        <option value="false">{t('false')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-third pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('dedup_threshold_score')}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={formData.dedup_threshold_score}
                                    onChange={(e) => setFormData({ ...formData, dedup_threshold_score: e.target.value })}
                                    disabled={!formData.dedup_is_enabled}
                                    className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all text-neutral-first/70 disabled:opacity-50 placeholder:text-secondary-third"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('functional_id_generation_required')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.functional_id_generation_required ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, functional_id_generation_required: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all bg-neutral-second appearance-none cursor-pointer text-neutral-first/70 pr-10"
                                    >
                                        <option value="true">{t('true')}</option>
                                        <option value="false">{t('false')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-third pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('completion_score_required')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.completion_score_required ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, completion_score_required: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all bg-neutral-second appearance-none cursor-pointer text-neutral-first/70 pr-10"
                                    >
                                        <option value="true">{t('true')}</option>
                                        <option value="false">{t('false')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-third pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('available_register_rank')}
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all bg-neutral-second appearance-none cursor-pointer text-neutral-first/70 pr-10"
                                        value=""
                                        onChange={() => { }}
                                    >
                                        <option value="">{t('view_existing_ranks')}</option>
                                        {[...registers]
                                            .sort((a, b) => (Number(a.register_rank) || 0) - (Number(b.register_rank) || 0))
                                            .map((register: Register) => (
                                                <option key={register.register_id} value={register.register_rank}>
                                                    {register.register_mnemonic} (Rank: {register.register_rank})
                                                </option>
                                            ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-third pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('register_rank')}
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 0"
                                    value={formData.register_rank}
                                    onChange={(e) => setFormData({ ...formData, register_rank: e.target.value })}
                                    className="w-full px-4 py-2 border border-primary-second rounded-lg outline-none outline-1 outline-primary-second transition-all text-neutral-first/70 placeholder:text-secondary-third"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-first mb-2">
                                    {t('register_icon')}
                                </label>
                                <div className="flex items-center gap-4">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-10 h-10 border-2 border-dashed border-primary-second rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary-first transition-colors overflow-hidden shrink-0"
                                    >
                                        {formData.register_icon ? (
                                            <img src={formData.register_icon} alt="icon" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="text-primary-second" size={20} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm text-primary-second font-medium hover:underline"
                                        >
                                            {formData.register_icon ? t('change_icon') : t('upload_icon')}
                                        </button>
                                        <p className="text-[10px] text-secondary-third">{t('max_size_2mb')}</p>
                                    </div>
                                    {formData.register_icon && (
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, register_icon: '' }))}
                                            className="text-[10px] text-toast-failed hover:underline"
                                        >
                                            {t('remove')}
                                        </button>
                                    )}
                                </div>
                            </div>



                        </div>


                        <div className="flex gap-4 pt-6 pb-2">
                            <button
                                onClick={handleCancel}
                                className="px-12 py-2.5 bg-secondary-third text-neutral-first rounded-[10px] hover:bg-secondary-third transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-2.5 bg-neutral-first text-neutral-second rounded-[10px] hover:bg-secondary-second-800 transition-colors"
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
