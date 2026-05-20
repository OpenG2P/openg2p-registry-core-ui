'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import Can from '@/components/shared/Can';
import { CONFIGURATION_TABS_ACTIONS } from '../shared/utils/configurationTabs.actions';
import { DataTable, DeleteButton, EditButton, ViewButton } from '../shared/components';
import {
    VCConfiguration,
    useAllVCConfigurations,
} from '@/features/configuration/shared/hooks/useAllVCConfigurations';
import AddVCConfigModal from './AddVCConfigModal';
import EditVCConfigModal from './EditVCConfigModal';

interface RegisterVCConfigViewProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    currentPage?: number;
    pageSize?: number;
    onDataLoaded?: (totalItems: number, currentCount: number) => void;
}

export default function RegisterVCConfigView({
    isModalOpen,
    onCloseModal,
    currentPage = 1,
    pageSize = 10,
    onDataLoaded,
}: RegisterVCConfigViewProps) {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const { vcConfigurations, loading, pagination, refresh } = useAllVCConfigurations(
        registerId,
        currentPage,
        pageSize,
    );
    const { execute: deleteConfig } = useFetch();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<VCConfiguration | null>(null);

    useEffect(() => {
        if (pagination && onDataLoaded) {
            onDataLoaded(pagination.number_of_items, vcConfigurations.length);
        }
    }, [pagination, vcConfigurations.length, onDataLoaded]);

    const proceedDelete = async (config: VCConfiguration) => {
        const result = await deleteConfig('/api/input-mechanism/delete-vc-configuration', {
            method: 'POST',
            body: JSON.stringify({
                vc_config_id: config.vc_config_id,
                register_id: config.register_id,
                intake_form_id: config.intake_form_id,
                data_model_id: config.data_model_id,
                vc_mnemonic: config.vc_mnemonic,
                descriptor_schema: config.descriptor_schema ?? {},
            }),
        });

        if (result?.vc_config_id) {
            toast.success(t('toast_vc_config_removed'));
            refresh();
        } else {
            toast.error(t('toast_vc_config_remove_failed'));
        }
    };

    const handleDelete = (config: VCConfiguration) => {
        toast.info(
            ({ closeToast }) => (
                <div className="p-1">
                    <p className="font-bold text-neutral-first mb-3">
                        {t('confirm_remove_vc_config')}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                closeToast();
                                await proceedDelete(config);
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
            key: 'vc_mnemonic',
            label: t('vc_mnemonic'),
        },
        {
            key: 'intake_form_id',
            label: t('form_id'),
        },
        {
            key: 'data_model_id',
            label: t('data_model_id'),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={vcConfigurations}
                loading={loading}
                rowKey={(item: VCConfiguration) => item.vc_config_id}
                actions={(item) => (
                    <div className="flex gap-4">
                       
                        <Can action={CONFIGURATION_TABS_ACTIONS.edit}>
                            <EditButton
                                label={t('common.edit')}
                                onClick={() => {
                                    setSelectedConfig(item);
                                    setEditModalOpen(true);
                                }}
                            />
                        </Can>
                        <Can action={CONFIGURATION_TABS_ACTIONS.delete}>
                            <DeleteButton
                                label={t('remove')}
                                onClick={() => handleDelete(item)}
                            />
                        </Can>
                    </div>
                )}
            />

            <AddVCConfigModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSuccess={refresh}
            />


            <EditVCConfigModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedConfig(null);
                }}
                onSuccess={refresh}
                initialData={selectedConfig}
            />
        </>
    );
}
