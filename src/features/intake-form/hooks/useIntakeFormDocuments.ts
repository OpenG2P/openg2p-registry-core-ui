import { useState, useEffect } from 'react';
import { useFetch } from '@/shared/hooks/useFetch';
import { UploadedDocument } from '@/shared/types';

export interface IntakeFormDocument extends UploadedDocument {
    document_url?: string;
}

export function useIntakeFormDocuments(documents: UploadedDocument[]) {
    const [docsWithUrls, setDocsWithUrls] = useState<IntakeFormDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const { execute: getUrl } = useFetch({ enabled: false });

    useEffect(() => {
        if (!documents || documents.length === 0) {
            setDocsWithUrls([]);
            return;
        }

        const fetchUrls = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    documents.map(async (doc) => {
                        try {
                            const response = await getUrl('/api/intake-form/get-file-url', {
                                method: 'POST',
                                body: JSON.stringify({ document_store_id: doc.document_store_id }),
                            });
                            return { 
                                ...doc, 
                                document_url: response?.document_url 
                            };
                        } catch (e) {
                            console.error('Failed to fetch URL for document:', doc.document_store_id, e);
                            return { ...doc };
                        }
                    })
                );
                setDocsWithUrls(results);
            } finally {
                setLoading(false);
            }
        };

        fetchUrls();
    }, [documents]);

    return { documents: docsWithUrls, loading };
}
