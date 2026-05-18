'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import Can from '@/components/shared/Can';
import { CONFIGURATION_TABS_ACTIONS } from '../shared/utils/configurationTabs.actions';
import { DataTable, DeleteButton, EditButton, ViewButton } from '../shared/components';
import { InputMechanism, useAllInputMechanisms } from '../shared';
import AddInputMechanismModal from './AddInputMechanismModal';
import EditInputMechanismModal from './EditInputMechanismModal';
import ViewInputMechanismModal from './ViewInputMechanismModal';

interface RegisterInputMechanismConfigViewProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    currentPage?: number;
    pageSize?: number;
    onDataLoaded?: (totalItems: number, currentCount: number) => void;
}

export default function RegisterInputMechanismConfigView({
    isModalOpen,
    onCloseModal,
    currentPage = 1,
    pageSize = 10,
    onDataLoaded,
}: RegisterInputMechanismConfigViewProps) {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const { inputMechanisms, loading, pagination, refresh } = useAllInputMechanisms(
        registerId,
        currentPage,
        pageSize,
    );
    const { execute: deleteMechanism } = useFetch();

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedMechanism, setSelectedMechanism] = useState<InputMechanism | null>(null);

    useEffect(() => {
        if (pagination && onDataLoaded) {
            onDataLoaded(pagination.number_of_items, inputMechanisms.length);
        }
    }, [pagination, inputMechanisms.length, onDataLoaded]);

    const proceedDelete = async (mechanismId: string) => {
        const result = await deleteMechanism('/api/configuration/registers/input-mechanism/delete-input-mechanism', {
            method: 'POST',
            body: JSON.stringify({ mechanism_id: mechanismId }),
        });

        if (result?.mechanism_id) {
            toast.success(t('toast_input_mechanism_removed'));
            refresh();
        } else {
            toast.error(t('toast_input_mechanism_remove_failed'));
        }
    };

    const handleDelete = (mechanismId: string) => {
        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-neutral-first mb-3">{t('confirm_remove_input_mechanism')}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(mechanismId);
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
                position: 'top-right',
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'rounded-[15px] shadow-xl border border-secondary-first',
            },
        );
    };

    const columns = [
        {
            key: 'display_key',
            label: t('display_key'),
        },
        {
            key: 'mechanism_type',
            label: t('mechanism_type'),
        },
        {
            key: 'mechanism_id',
            label: t('mechanism_id'),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={inputMechanisms}
                loading={loading}
                rowKey={(item: InputMechanism) => item.mechanism_id}
                actions={(item) => (
                    <div className="flex gap-4">
                   
                        <Can action={CONFIGURATION_TABS_ACTIONS.edit}>
                            <EditButton
                                label={t('common.edit')}
                                onClick={() => {
                                    setSelectedMechanism(item);
                                    setEditModalOpen(true);
                                }}
                            />
                        </Can>
                        <Can action={CONFIGURATION_TABS_ACTIONS.delete}>
                            <DeleteButton
                                label={t('remove')}
                                onClick={() => handleDelete(item.mechanism_id)}
                            />
                        </Can>
                    </div>
                )}
            />

            <AddInputMechanismModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSuccess={refresh}
            />

            <ViewInputMechanismModal
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedMechanism(null);
                }}
                data={selectedMechanism}
            />

            <EditInputMechanismModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedMechanism(null);
                }}
                onSuccess={refresh}
                initialData={selectedMechanism}
            />
        </>
    );
}
