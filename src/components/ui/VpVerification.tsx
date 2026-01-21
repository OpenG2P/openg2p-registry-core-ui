'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { OpenID4VPVerification } from 'inji-sdk';


// const OpenID4VPVerification = dynamic(
//     () =>
//         import('inji-sdk').then(
//             (mod) => mod.OpenID4VPVerification
//         ),
//     { ssr: false }
// );

const buildTabData = (result: any) => {
    const vcItem = result?.verifiableCredentials?.[0];
    const vc = vcItem?.vc;

    return {
        verificationResults: {
            verificationTimestamp: new Date().toISOString(),
            vpIntegrity: result?.vpVerified ? 'Valid' : 'Invalid',
            vcIntegrity: vcItem?.vcStatus === 'SUCCESS' ? 'Valid' : 'Invalid',
            vcRevocationStatus: 'Not Revoked',
            vcExpiryStatus:
                vc?.expirationDate &&
                    new Date(vc.expirationDate) > new Date()
                    ? 'Valid'
                    : 'Expired',
            policyCompliance: result?.policyVerified ? 'Valid' : 'Invalid',
            overallResult: result?.verified ? 'Verified' : 'Failed',
        },

        presentation: {
            presentationId: result?.vp?.id,
            holderDid: result?.vp?.holder,
            submissionId: result?.vp?.presentation_submission?.id,
            submissionTime: result?.vp?.issuanceDate,
        },

        credentials: result?.verifiableCredentials?.map((item: any) => ({
            credentialId: item?.vc?.id,
            types: item?.vc?.type,
            issuer: item?.vc?.issuer,
            issuanceDate: item?.vc?.issuanceDate,
            expiryDate: item?.vc?.expirationDate,
            proofType: item?.vc?.proof?.type,
            signatureAlgorithm: 'Ed25519',
            credentialStatus:
                item?.vcStatus === 'SUCCESS' ? 'Active' : 'Revoked',
        })),

        payload: result,
    };
};


const presentationDefinition = {
    id: process.env.NEXT_PUBLIC_VP_PRESENTATION_ID!,
    purpose: process.env.NEXT_PUBLIC_VP_PURPOSE!,
    format: {
        ldp_vc: {
            proof_type: ['Ed25519Signature2020'],
        },
    },
    input_descriptors: [
        {
            id: 'id-card-credential',
            constraints: {
                fields: [
                    {
                        path: ['$.type'],
                        filter: {
                            type: 'object',
                            pattern: 'VerifiableCredential',
                        },
                    },
                ],
            },
        },
    ],
};

export default function VpVerification() {
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState(0);

    const handleVPProcessed = (result: any) => {
        console.log('Verification result:', result);
        setVerificationResult(result);
        setVerificationStatus('success');
    };

    const handleError = (error: any) => {
        console.error('Verification error:', error);
        setError(error.message);
        setVerificationStatus('error');
    };

    const handleQrCodeExpired = () => {
        console.log('QR code expired');
        setError('QR code has expired. Please try again.');
        setVerificationStatus('error');
    };

    const handleStartVerification = () => {
        setVerificationStatus('verifying');
        setVerificationResult(null);
        setError(null);

        // Programmatically trigger the verification
        setTimeout(() => {
            const triggerButton = document.getElementById('vp-verification-trigger');
            if (triggerButton) {
                triggerButton.click();
            }
        }, 100);
    };

    useEffect(() => {
        handleStartVerification();
    }, [handleStartVerification]);

    const handleReset = useCallback(() => {
        setVerificationStatus('idle');
        setVerificationResult(null);
        setError(null);
    }, []);

    console.log(verificationResult)


    if (verificationStatus === 'success' && verificationResult) {
        return (
            <div className="verification-container">
                <div className="verification-result">
                    <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
                </div>
            </div>
        );
        // const tabData = buildTabData(verificationResult);

        // const tabs = [
        //     { label: 'Verification Results', data: tabData.verificationResults },
        //     { label: 'Presentation', data: tabData.presentation },
        //     { label: 'Credentials', data: tabData.credentials },
        //     { label: 'Raw Payload', data: tabData.payload },
        // ];

        // return (
        //     <>
        //         <div className="flex gap-2 mb-4">
        //             {tabs.map((tab, index) => (
        //                 <button
        //                     key={tab.label}
        //                     onClick={() => setActiveTab(index)}
        //                     className={`px-4 py-2 rounded-lg text-sm font-medium
        //                             ${activeTab === index
        //                             ? 'bg-yellow-400'
        //                             : 'bg-gray-200'}`}
        //                 >
        //                     {tab.label}
        //                 </button>
        //             ))}
        //         </div>

        //         <div className="flex-1 bg-gray-100 rounded-lg p-4 overflow-auto">
        //             <pre className="text-xs whitespace-pre-wrap">
        //                 {JSON.stringify(tabs[activeTab].data, null, 2)}
        //             </pre>
        //         </div>
        //     </>
        // );
    }

    if (verificationStatus === 'error') {
        return (
            <div className="verification-container">
                <h2>Verification Failed</h2>
                <div className="error-message">{error}</div>
                <button className="verify-button" onClick={handleReset}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <OpenID4VPVerification
                verifyServiceUrl={
                    process.env.NEXT_PUBLIC_VERIFY_SERVICE_URL!
                }
                presentationDefinition={presentationDefinition}
                onVPProcessed={handleVPProcessed}
                onError={handleError}
                onQrCodeExpired={handleQrCodeExpired}
                isSameDeviceFlowEnabled={false}
                clientId={
                    process.env.NEXT_PUBLIC_VP_CLIENT_ID!
                }
                triggerElement={
                    <button
                        id="vp-verification-trigger"
                        style={{ display: 'none' }}
                        aria-label="Start VP Verification"
                    />
                }
                qrCodeStyles={{
                    size: 500,
                    borderRadius: 16,
                    bgColor: '#ffffff',
                    fgColor: '#000000',
                }}
            />
            <div className="flex flex-col items-center gap-3">
                <Image
                    src="/loader.gif"
                    alt="loading"
                    width={40}
                    height={40}
                />
                <p className="font-medium">Importing your data</p>
                <p className="text-sm text-gray-500">
                    Please wait a few moments
                </p>
            </div>
        </div>
    );
}
