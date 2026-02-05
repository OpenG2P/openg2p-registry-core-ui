import type { Metadata } from "next";
import "@/commons/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContextProvider } from "@/context/GlobalContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header } from "@/components/layout";
import { RuntimeConfigProvider } from "@/context/RuntimeConfigContext";
import { RegisterProvider } from "@/context/RegisterContext";
import { ToastContainer } from "react-toastify";
import { Roboto } from 'next/font/google'
import { clientSafeConfig } from '@/app/api/_lib/client-safe-config';


const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
})

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    await clientSafeConfig.fetchRegistryConfig();
    const config = clientSafeConfig.getAll();

    return {
        title: config.registryName || t('title'),
        description: "",
        icons: {
            icon: config.registryLogo || "/openg2p_logo.png",
        },
    };
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();
    await clientSafeConfig.fetchRegistryConfig();
    const config = clientSafeConfig.getAll();


    return (
        <html lang={locale}>
            <body className={`${roboto.className} antialiased pt-17.5`}>
                <NextIntlClientProvider messages={messages}>
                    <GlobalContextProvider>
                        <RuntimeConfigProvider initialConfig={config}>
                            <Header />
                            <RegisterProvider>
                                <ToastContainer />
                                {children}
                            </RegisterProvider>
                        </RuntimeConfigProvider>
                    </GlobalContextProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

