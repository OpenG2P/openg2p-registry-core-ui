'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import AddRegisterModal from './AddRegisterModal';
import ViewRegisterFieldsModal from './ViewRegisterFieldsModal';
import { Register } from '../shared/types';

import Image from 'next/image';

import { useFetch } from '@/shared/hooks';

import { toast } from 'react-toastify';
import { CONFIGURATION_REGISTERS_ACTIONS } from '../shared/utils/configurationRegisters.actions';
import Can from '@/components/shared/Can';

interface RegistersConfigViewProps {
    registers: Register[];
    loading: boolean;
    refresh: () => void;
    onAddNewRegister: () => void;
    isModalOpen: boolean;
    onCloseModal: () => void;
    registerId?: string;
}

export default function RegistersConfigView({
    registers,
    loading,
    refresh,
    isModalOpen,
    onCloseModal,
}: RegistersConfigViewProps) {
    const t = useTranslations();
    const { execute: deleteRegister } = useFetch();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState<Register | undefined>(undefined);

    const proceedDelete = async (id: string, name: string) => {
        try {
            const result = await deleteRegister('/api/configuration/registers/delete', {
                method: 'POST',
                body: JSON.stringify({ register_id: id })
            });

            if (result) {
                toast.success(t('toast_register_deleted', { name }));
                refresh();
            } else {
                toast.error(t('toast_register_delete_failed'));
            }
        } catch (error) {
            toast.error(t('toast_register_delete_error'));
        }
    };

    const handleDelete = async (e: React.MouseEvent, register: Register) => {
        e.preventDefault();
        e.stopPropagation();

        if (register.has_data) {
            toast.error(t('toast_register_delete_has_data'));
            return;
        }

        const { register_id: id, register_mnemonic: name } = register;

        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-neutral-first mb-3">{t('confirm_delete_register', { name })}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(id, name);
                            }}
                            className="bg-primary-second text-neutral-second px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-second transition-colors shadow-sm"
                        >
                            {t('remove')}
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-secondary-first text-neutral-first/70 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-secondary-second transition-colors"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'rounded-[15px] shadow-xl border border-secondary-first',
            }
        );
    };

    const handleView = (e: React.MouseEvent, register: Register) => {
        e.preventDefault();
        e.stopPropagation();
        setViewData(register);
        setIsViewModalOpen(true);
    };

    return (
        <>
            <div className="mx-7.5 bg-neutral-second rounded-[10px] p-4 pt-8 overflow-hidden">
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-6 gap-4 pb-2 px-8 border-b border-secondary-first">
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('icon')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('mnemonic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('master_register')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('rank')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('purpose')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-primary-second tracking-wider">
                            {t('actions')}
                        </div>
                    </div>

                    {/* Data Rows */}
                    {loading ? (
                        <div className="flex justify-center items-center py-60">
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src="/images/common/loading.gif"
                                    alt="Loading"
                                    className="w-12 h-12"
                                />
                            </div>
                        </div>
                    ) : (
                        registers.map((register, index) => (
                            <Link
                                key={register.register_id}
                                href={`/configuration/registers/${register.register_id}`}
                                className="block -mx-8"
                            >
                                <div
                                    className={`grid grid-cols-6 gap-4 items-center px-16 h-15 transition-colors ${index % 2 === 0 ? 'bg-secondary-second/25' : 'bg-neutral-second'
                                        } cursor-pointer`}
                                >
                                    <div className="text-base font-medium flex items-center">
                                        {register.register_icon ? (
                                            <Image
                                                src={register.register_icon.startsWith('data:') ? register.register_icon : `data:image/png;base64,${register.register_icon}`}
                                                alt={register.register_mnemonic}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-contain"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-secondary-third border border-gray-200 rounded-md" />
                                        )}
                                    </div>

                                    <div className="text-base font-medium truncate">
                                        {register.register_mnemonic}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {register.master_register_mnemonic}
                                    </div>
                                    <div className="text-base font-medium">
                                        {register.register_rank}
                                    </div>
                                    <div className="text-base font-medium truncate">
                                        {register.register_purpose}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={(e) => handleView(e, register)}
                                            className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                            title={t('view')}
                                        >
                                            <span className="font-medium text-neutral-first/50">{t('view')}</span>
                                            <Image
                                                src="/images/common/view.png"
                                                alt={t('view')}
                                                width={18}
                                                height={18}
                                                className="ml-2"
                                            />
                                        </button>
                                        <Can action={CONFIGURATION_REGISTERS_ACTIONS.delete}>
                                            <button
                                                onClick={(e) => handleDelete(e, register)}
                                                className="flex items-center text-toast-success cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('remove')}
                                            >
                                                <span className=" font-medium text-neutral-first/50">{t('remove')}</span>
                                                <Image
                                                    src="/images/common/false_sign.png"
                                                    alt={t('remove')}
                                                    width={18}
                                                    height={18}
                                                    className="ml-2"
                                                />
                                            </button>
                                        </Can>
                                    </div>

                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <AddRegisterModal isOpen={isModalOpen} onClose={onCloseModal} onSuccess={refresh} />
            <ViewRegisterFieldsModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={viewData}
            />
        </>
    );
}
