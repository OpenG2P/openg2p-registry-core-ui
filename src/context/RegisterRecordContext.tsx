'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFetch } from '@/shared/hooks';
import { useRegister } from './RegisterContext';
import { RegisterRecordsApiResponse } from '@/features/register/types';

interface RegisterRecordContextValue {
    internalRecordId?: string;
    functionalRecordId: string;
    loading: boolean;
}

const RegisterRecordContext = createContext<RegisterRecordContextValue | null>(null);

export function RegisterRecordProvider({ children }: { children: ReactNode }) {
    const { id } = useParams<{ type: string; id: string }>();
    const { currentRegister } = useRegister();

    // The ID in the URL is the internal_record_id
    const internalRecordId = decodeURIComponent(id);

    // Fetch to resolve Functional ID and verify Internal ID
    const fetchOptions = useMemo(() => ({
        method: 'POST',
        body: JSON.stringify({
            current_page: 1,
            page_size: 1,
            sort_by: "",
            search_text: "",
            filter_by: {
                internal_record_id: {
                    eq: internalRecordId
                }
            },
            register_id: currentRegister?.register_id
        }),
    }), [internalRecordId, currentRegister?.register_id]);

    const { data, loading } = useFetch<RegisterRecordsApiResponse>({
        url: `/api/register/records`,
        enabled: !!currentRegister?.register_id && !!internalRecordId,
        options: fetchOptions,
    });

    const record = data?.records?.[0];
    const functionalRecordId = record?.functional_record_id || "-";
    const value = useMemo(() => ({
        internalRecordId,
        functionalRecordId,
        loading
    }), [internalRecordId, functionalRecordId, loading]);

    return (
        <RegisterRecordContext.Provider value={value}>
            {children}
        </RegisterRecordContext.Provider>
    );
}

export function useRegisterRecord() {
    const ctx = useContext(RegisterRecordContext);
    if (!ctx) {
        throw new Error(
            'useRegisterRecord must be used inside RegisterRecordProvider'
        );
    }
    return ctx;
}
