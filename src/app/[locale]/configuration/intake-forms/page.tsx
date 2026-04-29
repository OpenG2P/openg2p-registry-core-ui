'use client';

import { useState } from 'react';
import { TopBar } from '@/components/shared';
import { useFetch, usePagination } from '@/shared/hooks';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';
import { useRbac } from '@/context/RbacContext';
import { CONFIGURATION_REGISTERS_ACTIONS } from '@/features/configuration/shared/utils/configurationRegisters.actions';
import { useTranslations } from 'next-intl';
import { useAllIntakeForms } from '@/features/configuration/shared/hooks/useAllIntakeForms';
import { AddIntakeFormModal } from '@/features/configuration/intake-forms';
import { DeleteButton } from '@/features/configuration/shared/components';
import { toast } from 'react-toastify';
import ConfirmRemovePopup from '@/features/configuration/shared/components/ConfirmRemovePopup';
import { Link } from '@/i18n/navigation';

const IntakeFormPage = () => {
    const t = useTranslations();
    const [currentPage, setCurrentPage] = useState(1);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { execute: deleteIntakeForm } = useFetch();

    const { config } = useRuntimeConfig();

    const { can } = useRbac();
    const canCreate = can(CONFIGURATION_REGISTERS_ACTIONS.create);

    const { intake_forms, pagination, loading, refresh } = useAllIntakeForms(currentPage, config.pageSize);

    const { pageStart, pageEnd, total } = usePagination({
        totalItems: pagination?.number_of_items || 0,
        currentPage: currentPage,
        pageSize: config.pageSize || 10,
        currentCount: intake_forms?.length || 0,
    });

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const proceedDelete = async (id: string) => {
        try {
            const result = await deleteIntakeForm('/api/configuration/intake-forms/delete-intake-form', {
                method: 'POST',
                body: JSON.stringify({ form_id: id })
            });

            if (result?.form_id) {
                toast.success(t('intake_form_deleted'));
                refresh();
            } else {
                toast.error(t('toast_intake_form_deletion_failed'));
            }
        } catch (error) {
            toast.error(t('toast_operation_failed'));
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedItem) return;

        await proceedDelete(selectedItem.form_id);

        setShowPopup(false);
        setSelectedItem(null);
    };

    const handleDelete = (intakeForm: any) => {
        setSelectedItem(intakeForm);
        setShowPopup(true);
    };

    return (
        <>
            <TopBar
                breadcrumb={[{ label: t('intake_forms') }]}
                showFilters={false}
                showPagination
                showAddNewButton={canCreate}
                addNewButtonText={t('add_new_intake_form')}
                onAddNewButton={() => setModalType('add')}
                pageStart={pageStart}
                pageEnd={pageEnd}
                total={total}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <div className="mx-7.5 bg-neutral-second rounded-[10px] p-4 pt-8 overflow-hidden">
                <div>
                    <div className="grid grid-cols-5 gap-4 pb-2 px-8">
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('form_mnemonic')}
                        </div>
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('description')}
                        </div>
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('register')}
                        </div>
                        <div className="py-3 text-base font-semibold text-primary-second">
                            {t('verifications')}
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
                        intake_forms?.map((form: any, index: number) => (
                            <Link
                                key={form.form_id}
                                href={`/configuration/intake-forms/${form.form_id}`}
                                className="block -mx-8"
                            >
                                <div
                                    key={form.form_id}
                                    className={`grid grid-cols-5 gap-4 items-center px-16 h-16 ${index % 2 === 0
                                        ? 'bg-secondary-second/25'
                                        : 'bg-neutral-second'
                                        }`}
                                >
                                    <div className="text-base font-medium truncate">
                                        {form.form_mnemonic}
                                    </div>

                                    <div className="text-base truncate">
                                        {form.form_description}
                                    </div>

                                    <div className="text-base truncate">
                                        {form.register_mnemonic}
                                    </div>

                                    <div className="text-base">
                                        {form.number_of_verifications}
                                    </div>

                                    <div className="flex gap-4">
                                        <DeleteButton
                                            label={t('remove')}
                                            onClick={() => handleDelete(form)}
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
                    messageKey='confirm_remove_intake_form'
                />
            )}

            {modalType === 'add' && (
                <AddIntakeFormModal
                    onClose={() => setModalType(null)}
                    onSuccess={() => {
                        refresh();
                    }}
                />
            )}
        </>
    );
};

export default IntakeFormPage;
