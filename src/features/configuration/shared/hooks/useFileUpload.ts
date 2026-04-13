'use client';

import { useState } from 'react';
import { useFetch } from '@/shared/hooks';
import { toast } from 'react-toastify';

export const useFileUpload = (apiPath: string) => {
    const { execute } = useFetch();
    const [uploading, setUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const uploadFile = async (file: File) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('template_file', file);

            const result = await execute(apiPath, {
                method: 'POST',
                body: formData,
            });

            if (
                !Array.isArray(result) ||
                result.length === 0 ||
                !result[0]?.document_store_id
            ) {
                throw new Error('Upload failed: unexpected response');
            }

            const documentId = result[0].document_store_id;

            setUploadedFileName(file.name);
            toast.success('File uploaded successfully');

            return documentId;
        } catch (err) {
            console.error(err);
            toast.error('Upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return {
        uploadFile,
        uploading,
        uploadedFileName,
        setUploadedFileName,
    };
};