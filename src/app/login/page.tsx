"use client"
import { AuthUtil, LoginForm } from '@/features/auth/components';

export default function LoginPage() {
    return (
        <div className="relative h-screen bg-white flex items-center justify-center overflow-hidden">
            <AuthUtil successRedirectUrl={`/home`} />

            <div className="relative w-full max-w-[1600px] h-full max-h-[800px] mx-auto px-4">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
