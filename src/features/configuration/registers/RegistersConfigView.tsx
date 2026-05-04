'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import AddRegisterModal from './AddRegisterModal';
import ViewRegisterFieldsModal from './ViewRegisterFieldsModal';
import { Register } from '../shared/types';

import Image from 'next/image';

import { useFetch } from '@/shared/hooks';

import { toast } from 'react-toastify';
import { CONFIGURATION_REGISTERS_ACTIONS } from '../shared/utils/configurationRegisters.actions';
import Can from '@/components/shared/Can';
import { DataTable, DeleteButton, ViewButton } from '../shared/components';

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
    const router = useRouter();
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

    const handleDelete = async (register: Register) => {
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

    const handleView = (register: Register) => {
        setViewData(register);
        setIsViewModalOpen(true);
    };

    const columns = [
        {
            key: 'icon',
            label: t('icon'),
            render: (item: Register) =>
                item.register_icon ? (
                    <Image
                        src={
                            item.register_icon.startsWith('data:')
                                ? item.register_icon
                                : `data:image/png;base64,${item.register_icon}`
                        }
                        alt={item.register_mnemonic}
                        width={40}
                        height={40}
                        className="rounded-[10px] object-contain"
                    />
                ) : (
                    <div className="w-8 h-8 bg-secondary-third border border-gray-200 rounded-[10px]" />
                ),
        },
        {
            key: 'register_mnemonic',
            label: t('mnemonic'),
        },
        {
            key: 'master_register_mnemonic',
            label: t('master_register'),
        },
        {
            key: 'register_rank',
            label: t('rank'),
        },
        {
            key: 'register_purpose',
            label: t('purpose'),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={registers}
                loading={loading}
                rowKey={(item) => item.register_id}
                onRowClick={(item) =>
                    router.push(`/configuration/registers/${item.register_id}`)
                }
                actions={(item) => (
                    <>
                        <ViewButton
                            label={t('view')}
                            onClick={() => handleView(item)}
                        />

                        <Can action={CONFIGURATION_REGISTERS_ACTIONS.delete}>
                            <DeleteButton
                                label={t('remove')}
                                onClick={() => handleDelete(item)}
                            />
                        </Can>
                    </>
                )}
            />

            <AddRegisterModal isOpen={isModalOpen} onClose={onCloseModal} onSuccess={refresh} />
            <ViewRegisterFieldsModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={viewData}
            />
        </>
    );
}
