import type { Metadata } from "next";
import "@/commons/globals.css";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header } from "@/components/layout";
import { RegisterProvider } from "@/context/RegisterContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return {
        title: t('title'),
        description: "",
        icons: {
            icon: "/openg2p_logo.png",
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

    return (
        <html lang={locale}>
            <body
                className="antialiased pt-17.5"
            >
                <NextIntlClientProvider messages={messages}>
                    <GlobalContextProvider>
                        <Header />
                        <RegisterProvider>
                            <ToastContainer />
                            {children}
                        </RegisterProvider>
                    </GlobalContextProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
