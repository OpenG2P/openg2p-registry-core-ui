'use client';

import { useState } from 'react';
import { BreadcrumbBar, TopBar } from '@/components/shared';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import {
    ConfigDetailsSummary,
    DeleteButton,
} from '@/features/configuration/shared';

import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useFetch, usePagination } from '@/shared/hooks';
import { useRbac } from '@/context/RbacContext';
import { CONFIGURATION_TABS_ACTIONS } from '@/features/configuration/shared/utils/configurationTabs.actions';
import { CONFIGURATION_REGISTERS_ACTIONS } from '@/features/configuration/shared/utils/configurationRegisters.actions';
import { useTranslations } from 'next-intl';
import { useIntakeFormById } from '@/features/configuration/shared/hooks/useIntakeFormById';
import { useAllIntakeFormTabs } from '@/features/configuration/shared/hooks/useAllIntakeFormTabs';
import { Link } from '@/i18n/navigation';
import { toast } from 'react-toastify';
import { EditIntakeFormModal, ViewIntakeFormModal } from '@/features/configuration/intake-forms';
import AddIntakeFormTabModal from '@/features/configuration/intake-forms/AddIntakeFormTabModal ';
import ConfirmRemovePopup from '@/features/configuration/shared/components/ConfirmRemovePopup';


const IntakeFormIdPage = () => {
    const t = useTranslations();
    const { intakeformid } = useParams<{ intakeformid: string }>();
    const {
        intake_form,
        loading,
        refresh: editRefresh
    } = useIntakeFormById(intakeformid);

    const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { execute: deleteIntakeFormTab } = useFetch();


    const { can } = useRbac();
    const canEdit = can(CONFIGURATION_REGISTERS_ACTIONS.edit);
    const canCreate = can(CONFIGURATION_TABS_ACTIONS.create);


    const breadcrumb = useBreadcrumb({
        rootItem: { label: t('intake_form'), href: '/configuration/intake-forms' },
        customItems: [
            { label: `${intake_form?.form_mnemonic || ''}`, href: `/configuration/intake-forms/${intakeformid}` }
        ]
    });

    const [currentPage, setCurrentPage] = useState(1);
    const { config } = useRuntimeConfig();

    const { intake_form_tabs, refresh, pagination } = useAllIntakeFormTabs(currentPage, config.pageSize, intakeformid);

    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config.pageSize || 10,
        currentCount: intake_form_tabs?.length || 0,
    });

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    };

    const proceedDelete = async (id: string) => {
        try {
            const result = await deleteIntakeFormTab('/api/intake-form/delete-tab', {
                method: 'POST',
                body: JSON.stringify({ tab_id: id })
            });

            if (result?.tab_id) {
                toast.success(t('intake_form_tab_deleted'));
                editRefresh();
            } else {
                toast.error(t('toast_intake_form_tab_deletion_failed'));
            }
        } catch (error) {
            toast.error(t('toast_operation_failed'));
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedItem) return;

        await proceedDelete(selectedItem.tab_id);

        setShowPopup(false);
        setSelectedItem(null);
    };

    const handleDelete = (tab: any) => {
        setSelectedItem(tab);
        setShowPopup(true);
    };

    if (loading || !intake_form.form_id) {
        return (
            <div className="min-h-screen bg-secondary-first flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-second"></div>
            </div>
        );
    }



    return (
        <>
            <div className="pt-10 px-7.5 mb-6">
                <BreadcrumbBar breadcrumb={breadcrumb} />
            </div>

            <ConfigDetailsSummary
                title={intake_form?.form_mnemonic || t('none')}
                description={intake_form?.form_description}
                extraInfo1={intake_form?.register_mnemonic || t('none')}
                onEdit={
                    canEdit
                        ? () => setModalType('edit')
                        : undefined
                }
                onView={() => setModalType('view')}
            />

            <div className=" ml-4 mt-4 px-7.5">
                <div className="flex justify-between items-center h-14">


                    {/* TopBar */}
                    <div className="font-medium text-[20px]">{t('intake_form_tabs')}</div>
                    <div className="flex items-center h-full">
                        <TopBar
                            breadcrumb={[]}
                            showFilters={false}
                            showPagination={true}
                            showAddNewButton={canCreate}
                            addNewButtonText={t('add_new_tab')}
                            onAddNewButton={() => setModalType('add')}
                            showSecondaryButton={false}
                            pageStart={pageStart}
                            pageEnd={pageEnd}
                            total={total}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            showCapsule={false}
                        />
                    </div>
                </div>
            </div>
            <div className="mx-7.5 bg-neutral-second rounded-[10px] p-4 pt-8 overflow-hidden">
                <div>
                    <div className="grid grid-cols-5 gap-4 pb-2 px-8">
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('tab_id')}
                        </div>
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('tab_label')}
                        </div>
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('tab_order')}
                        </div>
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('actions')}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-40">
                            <img
                                src="/images/common/loading.gif"
                                alt="Loading"
                                className="w-10 h-10"
                            />
                        </div>
                    ) : (
                        intake_form_tabs?.map((tab: any, index: number) => (
                            <Link
                                key={tab.tab_id}
                                href={`/configuration/intake-forms/${intakeformid}/tabs/${tab.tab_id}`}
                                className="block -mx-8"
                            >
                                <div
                                    key={tab.tab_id}
                                    className={`grid grid-cols-5 gap-4 items-center px-16 h-16 ${index % 2 === 0
                                        ? 'bg-secondary-second/25'
                                        : 'bg-neutral-second'
                                        }`}
                                >
                                    <div className="text-base font-medium truncate">
                                        {tab.tab_id}
                                    </div>

                                    <div className="text-base font-medium truncate">
                                        {tab.tab_label}
                                    </div>

                                    <div className="text-base truncate">
                                        {tab.tab_order}
                                    </div>

                                    <div className="flex gap-4">
                                        <DeleteButton
                                            label={t('remove')}
                                            onClick={() => handleDelete(tab)}
                                        />
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
                        setSelectedItem(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    messageKey='confirm_remove_intake_form_tab'
                />
            )}

            {modalType === 'view' && (
                <ViewIntakeFormModal
                    data={intake_form}
                    onClose={() => {
                        setModalType(null);
                        setSelectedItem(null);
                    }}
                />
            )}

            {modalType === 'edit' && (
                <EditIntakeFormModal
                    initialData={intake_form}
                    onClose={() => {
                        setModalType(null);
                        setSelectedItem(null);
                    }}
                    onSuccess={() => {
                        editRefresh();
                    }}
                />
            )}

            {modalType === 'add' && (
                <AddIntakeFormTabModal
                    intakeFormId={intakeformid}
                    onClose={() => setModalType(null)}
                    onSuccess={() => {
                        refresh();
                    }}
                />
            )}
        </>
    );
};

export default IntakeFormIdPage;
