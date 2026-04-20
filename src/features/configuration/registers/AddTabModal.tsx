import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/shared/hooks';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { BaseModal, InputField } from '../shared/components';

interface AddTabModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddTabModal({ onClose, onSuccess }: AddTabModalProps) {
    const t = useTranslations();
    const { registerId } = useParams<{ registerId: string }>();
    const { execute: createTab, loading } = useFetch();

    const [formData, setFormData] = useState({
        tabName: '',
        tabOrder: '',
    });

    const handleSubmit = async () => {
        if (!formData.tabName) {
            toast.warn('Tab Name is required');
            return;
        }

        const result = await createTab('/api/configuration/registers/tabs/create', {
            method: 'POST',
            body: JSON.stringify({
                register_id: registerId,
                tab_label: formData.tabName,
                tab_order: Number(formData.tabOrder) || 0,
                used_for_new_intake_form: false
            })
        });

        if (result?.tab_id) {
            toast.success('Tab created successfully');
            setFormData({ tabName: '', tabOrder: '' });
            if (onSuccess) onSuccess();
            onClose();
        } else {
            toast.error('Failed to create tab');
        }
    };

    const handleCancel = () => {
        setFormData({
            tabName: '',
            tabOrder: '',
        });
        onClose();
    };

    return (
        <BaseModal
            title={t('add_new_tab')}
            onClose={handleCancel}
            primaryActionLabel={t('save')}
            onPrimaryAction={handleSubmit}
            maxWidth="max-w-200"
        >
            <InputField
                label={t('tab_name')}
                value={formData.tabName}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        tabName: value,
                    }))
                }
            />

            <InputField
                label={t('tab_order')}
                type='number'
                min={0}
                value={formData.tabOrder}
                onChange={(value) =>
                    setFormData((prev) => ({
                        ...prev,
                        tabOrder: value,
                    }))
                }
            />
        </BaseModal>
    );
}
