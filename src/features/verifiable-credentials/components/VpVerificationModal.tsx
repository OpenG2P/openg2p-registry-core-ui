'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { OpenID4VPVerification } from 'inji-sdk';
import { buildPayloadFromDecodedJWT, decodeSdJwtToken } from '@/features/verifiable-credentials/utils';
import { PayloadView, StatusView } from '@/features/verifiable-credentials/components';
import { useRuntimeConfig } from '@/context/RuntimeConfigContext';

interface Props {
    descriptorSchema: any;
    onClose: () => void;
}
const HARDCODED_RESULT = [
    {
        "vc": "eyJ4NWMiOlsiTUlJQ0JqQ0NBYXVnQXdJQkFnSVVQWDU0a0Vwbk4rWVZSU3JZRTNaRnZGVzBTNVF3Q2dZSUtvWkl6ajBFQXdJd0p6RWxNQ01HQTFVRUF3d2NkbU10WkdWdGJ5NXZjR1Z1WTNKMmN5NWtaWFlnVW05dmRDQkRRVEFlRncweU5qQXhNamd4TVRNeE16bGFGdzB6TmpBeE1qWXhNVE14TXpsYU1COHhIVEFiQmdOVkJBTU1GSFpqTFdSbGJXOHViM0JsYm1OeWRuTXVaR1YyTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFQWFIaTZ6aWQyMGRyalBnTXRpd25sdVc1RHQyd1pLMjVRcUZncGdjS1lPb0N2dUtOeWRmVm5hTzZOZy8vTk1WNW1MTTdtc3N1dzA4ZEQ5UUROWExsNktPQnZEQ0J1VEFKQmdOVkhSTUVBakFBTUE0R0ExVWREd0VCL3dRRUF3SUhnREFkQmdOVkhTVUVGakFVQmdnckJnRUZCUWNEQWdZSUt3WUJCUVVIQXdFd1BRWURWUjBSQkRZd05JSVVkbU10WkdWdGJ5NXZjR1Z1WTNKMmN5NWtaWGFHSEdoMGRIQnpPaTh2ZG1NdFpHVnRieTV2Y0dWdVkzSjJjeTVrWlhZd0hRWURWUjBPQkJZRUZGWk5hYXE5MW5KbVU0L2VhUXJjWCtBallzdmNNQjhHQTFVZEl3UVlNQmFBRkVxSnB0NGErWW5uZ1RlelJadjEwOVg2ZHNQQk1Bb0dDQ3FHU000OUJBTUNBMGtBTUVZQ0lRQzBoblV4aXdFZXpvbjZGWFZaWW16dDVsaG5KZ1V0QnJzS0w4UlNoOVlKRWdJaEFNV05UUUhBWEp4T0cxYkZuVXI2elorRWhIc1orajR6Tk1uSEdhb1ZFWUlsIiwiTUlJQjh6Q0NBWnFnQXdJQkFnSVVjbzJGd2p5RUFBY3Btb2RIbDRNNDJYa1NKakF3Q2dZSUtvWkl6ajBFQXdJd0p6RWxNQ01HQTFVRUF3d2NkbU10WkdWdGJ5NXZjR1Z1WTNKMmN5NWtaWFlnVW05dmRDQkRRVEFlRncweU5qQXhNamd4TVRNeE16bGFGdzB6TmpBeE1qWXhNVE14TXpsYU1DY3hKVEFqQmdOVkJBTU1ISFpqTFdSbGJXOHViM0JsYm1OeWRuTXVaR1YySUZKdmIzUWdRMEV3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVNTcFlVM2dvak1hTkUvb29yc2lkVWcyMkp0WE8zTzlFNHRJY0VoaGM4cmx5TG9WZFhJQ0lZRmpWeEFiSklZczFzdTVvMmVNWVBJS1MwZ013b3FrR0ZhbzRHak1JR2dNQjBHQTFVZERnUVdCQlJLaWFiZUd2bUo1NEUzczBXYjlkUFYrbmJEd1RBZkJnTlZIU01FR0RBV2dCUktpYWJlR3ZtSjU0RTNzMFdiOWRQVituYkR3VEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQTRHQTFVZER3RUIvd1FFQXdJQkJqQTlCZ05WSFJFRU5qQTBnaFIyWXkxa1pXMXZMbTl3Wlc1amNuWnpMbVJsZG9ZY2FIUjBjSE02THk5Mll5MWtaVzF2TG05d1pXNWpjblp6TG1SbGRqQUtCZ2dxaGtqT1BRUURBZ05IQURCRUFpQjAwcXpmQnFObitWc2p2NEQrK1pINU9LMmNiZWJNRDhtQjd3THZGL3lpcGdJZ2I0cjZUaFdqbXd0Zi9QS0hmL3NXNHo1VmJjclpQZEpCUDFqSDZjQThHb1E9Il0sImtpZCI6IkR6MmJoX0pnUXhrRXRwbVFTUnJJdGxWUWdFcjN3THRDc1Q3OHV1aWFSTFkiLCJ0eXAiOiJ2YytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJuYXRpb25hbGl0aWVzIjpbIkZBUiJdLCJzZXgiOjIsInBhcmVudHMiOlt7ImdpdmVuX25hbWUiOiJNYXZpcyIsIm1pZGRsZV9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiJTbWl0aCIsImlkZW50aWZpZXIiOiI4Nzc2NjU1NDQzIiwibmF0aW9uYWxpdGllcyI6WyJGQVIiXX0seyJuYXRpb25hbGl0aWVzIjpbIkZBUiJdfV0sImlkIjoidXJuOnV1aWQ6N2ViMTFlODEtNTg2Yy00MmIxLThiNmMtZDA3ZjczNDc3OGNlIiwiaWF0IjoxNzY5NzY0MTUwLCJuYmYiOjE3Njk3NjQxNTAsImV4cCI6MTgwMTMwMDE1MCwiX3NkX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL3ZjLWRlbW8ub3BlbmNydnMuZGV2IiwiY25mIjp7Imp3ayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2Iiwia2lkIjoiODQyNmRkYjUtMTFjMS00YTQyLWI5YjYtNDE2NDcyM2I1NTUzIiwieCI6Ilg0dnNJNzJzT2Fib1VnUFNLQm9kTDI0YXZCR0hDQWxlNEwxZnM5QVo1X1kiLCJ5IjoieE9jelBwLU9IdENjM3RYRVdqYlgtTkZ3ZktHRlczaExYVlJJMzNsWmlIRSJ9fSwidmN0IjoiY3J2c19iaXJ0aF92MSIsIl9zZCI6WyJjZUJ4TnZmYno4VW9VUmpELVRrcmsxdE41MVNPd3RwbkNUUWxZaUJUd3JvIiwiRTdOQmRiN3R0enNwdnFvbEk4NW1MV2x3dE9hbWZlT183ZzNuUVdQT0xvNCIsIndMelRwUkt5QzFkSFVBcC0tWW5CYjktazVDOHVmMzJfYlZyZkZSTFNkeDQiLCJhclhhZlctcnViWTMyS1Vra1lfYXVvY0NIX08tVE4yOHZ2N2RpWTRtSWg4IiwiSDhSTm5LYi1JRmxUWGQtRmpkRVB5VTJvUTRPbFU3YTNkYmt1NXJyeHJRUSJdfQ.sGGI3Ss93KnjKd7ICgbGRgQLRfJ31kAG03GRkXeZctFsx7cX8lOyh_C5ODODv163nSCVMNRZmM6ArCINmxEsAg~WyJHdGltdG8wb3NWMDJyb0FPYkNEeFJRIiwiZ2l2ZW5fbmFtZSIsIkRhd24iXQ~WyIyVGlob2ctSm81c09TYkd1RC15MG1BIiwibWlkZGxlX25hbWUiLCIiXQ~WyI0WnpoaGFNZGpQN1FNT0NvZDlDOXhBIiwiZmFtaWx5X25hbWUiLCJGcmVuY2giXQ~WyI5YWZpR2Q2WXBhSVhUYk5pVGViVGhBIiwiYmlydGhkYXRlIiwiMjAyNS0wMi0xMiJd~WyI0NFJSVHNMWk80UnFjaG5Pb1luT3V3IiwicGxhY2Vfb2ZfYmlydGgiLHsibmFtZSI6IkNoYW1ha3ViaSBIZWFsdGggUG9zdCwgSWJvbWJvLCBDZW50cmFsIiwiY291bnRyeSI6IkZBUiJ9XQ~",
        "vcStatus": "SUCCESS"
    }
]

// const HARDCODED_RESULT = [
//     {
//         "vc": "eyJraWQiOiJkaWQ6a2V5Ono2TWtqb1JocTFqU05KZExpcnVTWHJGRnhhZ3FyenRaYVhIcUhHVVRLSmJjTnl3cCN6Nk1ram9SaHExalNOSmRMaXJ1U1hyRkZ4YWdxcnp0WmFYSHFIR1VUS0piY055d3AiLCJ0eXAiOiJ2YytzZC1qd3QiLCJhbGciOiJFZERTQSJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vc2NoZW1hcy5vcGVuY3J2cy5vcmcvYmlydGgtY2VydGlmaWNhdGUuanNvbiJdLCJpZCI6InVybjp1dWlkOmRlMGI5YmI0LTVmZmItNDhiZi1hNDA0LTJlNzk4ZmVlYjhhYSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJCaXJ0aENlcnRpZmljYXRlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJnaXZlbl9uYW1lIjoiU2ltbXkiLCJmYW1pbHlfbmFtZSI6Ikpvbm5hdGhhbiIsImJpcnRoZGF0ZSI6IjIwMjQtMDItMjUiLCJwbGFjZV9vZl9iaXJ0aCI6IkNoYW1ha3ViaSBIZWFsdGggUG9zdCwgSWJvbWJvLCBDZW50cmFsLCBGYXJhamFsYW5kIiwiaWQiOiJkaWQ6andrOmV5SnJkSGtpT2lKRlF5SXNJbXRwWkNJNkluRjRORTFtVWtSSWJFRmlRbk5UVm5GYVprcHhURFY2VTNjek5IaFlWazFQZWxNMk4yZG5jMDEzWkhNaUxDSmpjbllpT2lKUUxUSTFOaUlzSW5naU9pSXRRVEZHVlZKQmNETm9XWE16U1ZJMVdXRklOM2RYYjI5cU1WbG5WbWRMVFhkS1NDMTBjMWx3YUY5aklpd2llU0k2SW1aSVRVVkNORFZqUTA5Q2RGQktZWGcxV2t0WGFtTXdWa0oyUkhKQk5DMTZZV05OUzFkYWVUSTBNRFFpTENKMWMyVWlPaUp6YVdjaWZRIn0sImlzcyI6ImRpZDprZXk6ejZNa2pvUmhxMWpTTkpkTGlydVNYckZGeGFncXJ6dFphWEhxSEdVVEtKYmNOeXdwIiwiaXNzdWFuY2VEYXRlIjoiMjAyNi0wMS0yNlQwOToxMzo0OS44MzEwOTA2MjZaIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDI3LTAxLTI2VDA5OjEzOjQ5LjgzMTEyODAyNloiLCJfc2RfYWxnIjoic2hhLTI1NiIsImNuZiI6eyJraWQiOiJkaWQ6andrOmV5SnJkSGtpT2lKRlF5SXNJbXRwWkNJNkluRjRORTFtVWtSSWJFRmlRbk5UVm5GYVprcHhURFY2VTNjek5IaFlWazFQZWxNMk4yZG5jMDEzWkhNaUxDSmpjbllpT2lKUUxUSTFOaUlzSW5naU9pSXRRVEZHVlZKQmNETm9XWE16U1ZJMVdXRklOM2RYYjI5cU1WbG5WbWRMVFhkS1NDMTBjMWx3YUY5aklpd2llU0k2SW1aSVRVVkNORFZqUTA5Q2RGQktZWGcxV2t0WGFtTXdWa0oyUkhKQk5DMTZZV05OUzFkYWVUSTBNRFFpTENKMWMyVWlPaUp6YVdjaWZRIn0sInZjdCI6ImNydnNfYmlydGhfdjEifQ.ftcnXZwajzcH9OFMuY1BirNF1bQM3kVExqvJILKWuc02uPYpBawHuMqKHWGwJB0WscbbZa5smxfPolDct4LZAg~eyJhbGciOiJFUzI1NiIsInR5cCI6ImtiK2p3dCJ9.eyJpYXQiOjE3Njk0MTg4NjAsImF1ZCI6ImRpZDp3ZWI6cmVnaXN0cnktZmFtaWx5LnBsYXkub3BlbmcycC5vcmc6djE6dmVyaWZ5Iiwibm9uY2UiOiJNVGMyT1RReE9EZzFNRGMxT1E9PSIsInNkX2hhc2giOiJZeUJTZGN1ZDVvd2VoaTJrb2ZQMkhOQUl0MERwQ0tOR0o1M1p2WmY4N2FZIn0.c9Ojg5Nkye0gq3eLwRWszrCylHzH-pW1NQMaepFrjZUOrM-89TfRSoSWeiWjF-aeQ-R4onMKGWhB1w3Wiuna_Q",
//         "vcStatus": "INVALID"
//     }
// ]

export default function VpVerificationModal({
    descriptorSchema,
    onClose,
}: Props) {

    // env variable 
    const { config } = useRuntimeConfig();

    const [verificationComplete, setVerificationComplete] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

    const [verificationResult, setVerificationResult] = useState<any>(null);

    const [error, setError] = useState<string | null>(null);

    const presentationDefinition = useMemo(() => {
        return {
            id: config.vpPresentationId!,
            purpose: config.vpPurpose!,
            format: {
                ldp_vc: {
                    proof_type: ["Ed25519Signature2020", "EdDSA", "ES256"],
                },
            },
            input_descriptors: [descriptorSchema],
        };
    }, [descriptorSchema]);

    const [activeTab, setActiveTab] = useState<'status' | 'payload'>('status');

    const [importResult, setImportResult] = useState<any>(null);
    const [isImporting, setIsImporting] = useState(false);


    const handleVPProcessed = async (result: any[]) => {
        const processedResult = await Promise.all(
            result.map(async (vpResult) => {
                if (typeof vpResult?.vc !== "string") return vpResult;

                try {
                    const { decodedJwt, regularClaims, disclosedClaims, decoded } = await decodeSdJwtToken(vpResult.vc);

                    const payload = buildPayloadFromDecodedJWT(decodedJwt, regularClaims, disclosedClaims);

                    // return {
                    //     ...vpResult,
                    //     vc: payload,
                    //     decodedJwt,
                    // };
                    return {
                        ...vpResult,
                        vc: decoded,
                        // decodedJwt,
                    };
                } catch (e) {
                    console.error("SD-JWT decode failed:", e);
                    return vpResult;
                }
            })
        );

        setVerificationResult(processedResult);
        setVerificationStatus("success");
        setVerificationComplete(true)
    };



    const handleError = (error: any) => {
        setError(error.message);
        setVerificationStatus('error');
    };

    const handleQrCodeExpired = () => {
        setError('QR code has expired. Please try again.');
        setVerificationStatus('error');
    };

    const handleStartVerification = useCallback(() => {
        setVerificationStatus('verifying');
        setVerificationResult(null);
        setError(null);

        setTimeout(() => {
            const triggerButton = document.getElementById('vp-verification-trigger');
            triggerButton?.click();
        }, 100);
    }, []);


    useEffect(() => {
        handleStartVerification();
    }, [handleStartVerification]);


    const processHardcodedResult = async () => {
        try {
            const processedResult = await Promise.all(
                HARDCODED_RESULT.map(async (vpResult) => {
                    if (typeof vpResult.vc !== "string") return vpResult;

                    const { decodedJwt, regularClaims, disclosedClaims, decoded } = await decodeSdJwtToken(vpResult.vc);

                    console.log(decodedJwt, "decJWT")
                    console.log(regularClaims, "regJWT")
                    console.log(disclosedClaims, "disJWT")


                    const payload = buildPayloadFromDecodedJWT(decodedJwt, regularClaims, disclosedClaims);

                    // return {
                    //     ...vpResult,
                    //     vc: payload,
                    //     decodedJwt,
                    // };
                    return {
                        ...vpResult,
                        vc: decoded,
                        // decodedJwt,
                    };
                })
            );

            setVerificationResult(processedResult);
            setVerificationStatus("success");

            console.log(processedResult, "res")
        } catch (e) {
            console.error("SD-JWT decode failed:", e);
            setVerificationStatus("error");
            setError("Failed to decode hardcoded credential");
        }
    };

    const handleReset = useCallback(() => {
        setVerificationStatus('idle');
        setVerificationResult(null);
        setError(null);
        handleStartVerification()
    }, []);

    const handleImport = useCallback(async (data: any[]) => {
        try {
            const vcPayload = data?.[0]?.vc;
            if (!vcPayload) return;

            setIsImporting(true);
            setError(null);

            const res = await fetch('/api/partner_ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vc: vcPayload }),
            });

            if (!res.ok) {
                throw new Error('Import failed');
            }

            const result = await res.json();

            setImportResult(result);
            setVerificationComplete(true);
        } catch (err) {
            console.error('Import error:', err);
            setError('Failed to import verified credential');
        } finally {
            setIsImporting(false);
        }
    }, []);


    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div
                className={`relative bg-white rounded-[40px] p-10 border-10 border-[#F2BA1A] flex flex-col transition-all duration-300 ${verificationStatus === 'success' ? 'w-200 h-160' : 'w-150 h-120'}`}
            >
                <div
                    className={`flex items-center mb-3 transition-all ${verificationComplete ? 'justify-between' : 'justify-center relative'}`}
                >
                    <h2
                        className={`text-xl font-semibold transition-all ${verificationComplete ? 'text-left' : 'text-center'}`}
                    >
                        Verify Credential
                    </h2>

                    <button
                        onClick={onClose}
                        className={`opacity-60 hover:opacity-100 transition-all ${verificationComplete ? 'static' : 'absolute right-0'}`}
                    >
                        <Image src="/images/changerequest/cr_close.png" alt="Close" width={30} height={30} />
                    </button>
                </div>

                <div className="flex flex-col h-full">
                    {importResult ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <Image src="/images/common/verified.png" alt="success" width={60} height={60} />

                            <h3 className="text-[22px] font-semibold mt-4">
                                Import Successful
                            </h3>

                            <p className="text-gray-600 mt-2">
                                Credential was successfully ingested
                            </p>

                            <div className="mt-6 w-full bg-gray-50 rounded-[20px] p-4 text-center text-sm">
                                <p>
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className="text-green-600">
                                        {importResult.message.ack_status}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">Correlation ID:</span>{' '}
                                    {importResult.message.correlation_id}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-6 bg-black text-white px-10 py-2 rounded-[20px]"
                            >
                                Close
                            </button>
                        </div>
                    ) : verificationStatus === 'success' && verificationResult ? (
                        <>
                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={() => setActiveTab('status')}
                                    className={`px-8 py-2 rounded-t-[20px] text-[18px] font-medium ${activeTab === 'status'
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    Status
                                </button>

                                <button
                                    onClick={() => setActiveTab('payload')}
                                    className={`px-8 py-2 rounded-t-[20px] text-[18px] font-medium ${activeTab === 'payload'
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    Payload
                                </button>
                            </div>

                            {activeTab === 'status' ? (
                                <StatusView vp={verificationResult[0]} />
                            ) : (
                                <PayloadView data={verificationResult} />
                            )}

                            <div className="my-6 flex justify-center">
                                <button
                                    onClick={() => handleImport(verificationResult)}
                                    disabled={isImporting}
                                    className="bg-black text-white px-10 py-2 rounded-[20px] disabled:opacity-50"
                                >
                                    {isImporting ? 'Importing…' : 'Import'}
                                </button>

                            </div>
                        </>
                    ) : verificationStatus === 'error' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <p className="text-[18px] text-gray-800 mb-6">
                                {error || 'We could not verify the credential. Please try scanning again.'}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleReset}
                                    className="bg-black text-white px-8 py-2 rounded-[20px]"
                                >
                                    Try again
                                </button>

                                <button
                                    onClick={processHardcodedResult}
                                    className="bg-black text-white px-8 py-2 rounded-[20px]"
                                >
                                    Demo data
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <OpenID4VPVerification
                                verifyServiceUrl={config?.verifyServiceUrl}
                                presentationDefinition={presentationDefinition}
                                onVPProcessed={handleVPProcessed}
                                onError={handleError}
                                onQrCodeExpired={handleQrCodeExpired}
                                isSameDeviceFlowEnabled={false}
                                clientId={config?.vpClientId!}
                                triggerElement={
                                    <button
                                        id="vp-verification-trigger"
                                        style={{ display: 'none' }}
                                        aria-label="Start VP Verification"
                                    />
                                }
                                qrCodeStyles={{
                                    size: 200,
                                    borderRadius: 16,
                                    bgColor: '#ffffff',
                                    fgColor: '#000000',
                                }}
                            />
                            <div className="flex flex-col items-center gap-3">
                                {/* <Image src="/images/common/loader.gif" alt="loading" width={40} height={40} /> */}
                                <p className="font-medium">Importing your data</p>
                                <p className="text-sm text-gray-500">Please wait a few moments</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
