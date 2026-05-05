'use client';

import { useState, useRef } from 'react';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { BaseModal, FileUploadField } from '@/features/configuration/shared';
import { useDocumentUpload } from '@/features/register/hooks/useDocumentUpload';

interface ImportModalProps {
    onClose: () => void;
    registerId?: string;
}

export default function ImportModal({
    onClose,
    registerId,
}: ImportModalProps) {
    const { execute } = useFetch();

    const { uploadDocument } = useDocumentUpload((url, options) =>
        execute(url, options)
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setUploadedFileName(file.name);
        e.target.value = '';
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadedFileName('');
    };

    const handleImport = async () => {
        if (!selectedFile || !registerId) {
            toast.warn('All fields are required');
            return;
        }

        try {
            setUploading(true);

            const uploadedDoc = await uploadDocument({
                file: selectedFile,
                label: 'import_file',
            });

            console.log(uploadedDoc,"*********************8")

            // if (!uploadedDoc) {
            //     toast.error('File upload failed');
            //     return;
            // }

            // const result = await execute('/api/intake/import', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         intakeform_id: intakeFormId,
            //         docstore_id: uploadedDoc.document_store_id,
            //         register_id: registerId,
            //     }),
            // });

            // if (result) {
            //     toast.success('Import successful');
            //     onClose();
            // } else {
            //     toast.error('Import failed');
            // }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setUploading(false);
        }
    };

    return (
        <BaseModal
            title="Import File"
            onClose={onClose}
            primaryActionLabel="Import"
            onPrimaryAction={handleImport}
            maxWidth="max-w-150"
        >
            <FileUploadField
                label="Upload File"
                fileInputRef={fileInputRef}
                uploading={uploading}
                fileName={uploadedFileName}
                fileId=""
                onFileChange={handleFileChange}
                onRemove={handleRemoveFile}
            />
        </BaseModal>
    );
}