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
import ConfirmRemovePopup from '../shared/components/ConfirmRemovePopup';

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
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);

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

    const handleDelete = (e: React.MouseEvent, register: Register) => {
        e.preventDefault();
        e.stopPropagation();

        if (register.has_data) {
            toast.error(t('toast_register_delete_has_data'));
            return;
        }

        setSelectedRegister(register);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        if (!selectedRegister) return;

        const { register_id: id, register_mnemonic: name } = selectedRegister;

        await proceedDelete(id, name);

        setShowPopup(false);
        setSelectedRegister(null);
    };

    const handleView = (e: React.MouseEvent, register: Register) => {
        e.preventDefault();
        e.stopPropagation();
        setViewData(register);
        setIsViewModalOpen(true);
    };

    return (
        <>
            <div className="mx-7.5 bg-white rounded-[10px] p-4 pt-8 overflow-hidden">
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-6 gap-4 pb-2 px-8 border-b border-gray-100">
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('icon')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('mnemonic')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('master_register')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('rank')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
                            {t('purpose')}
                        </div>
                        <div className="py-3 text-left text-base font-semibold text-[#ED7C22] tracking-wider">
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
                                    className={`grid grid-cols-6 gap-4 items-center px-16 h-15 transition-colors ${index % 2 === 0 ? 'bg-[#D9D9D940]' : 'bg-white'
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
                                            <div className="w-8 h-8 bg-gray-300 border border-gray-200 rounded-md" />
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
                                            <span className="text-sm font-medium">{t('view')}</span>
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
                                                className="flex items-center text-[#1cc9b7] cursor-pointer hover:opacity-80 transition-opacity"
                                                title={t('remove')}
                                            >
                                                <span className="tsmext- font-medium text-[#00000080]">{t('remove')}</span>
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

            {showPopup && (
                <ConfirmRemovePopup
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedRegister(null);
                    }}
                    onConfirm={confirmDelete}
                    messageKey="confirm_delete_register"
                />
            )}

            {isModalOpen && (
                <AddRegisterModal
                    onClose={onCloseModal}
                    onSuccess={refresh}
                />
            )}
            {isViewModalOpen && (
                <ViewRegisterFieldsModal
                    onClose={() => setIsViewModalOpen(false)}
                    data={viewData}
                />
            )}
        </>
    );
}
