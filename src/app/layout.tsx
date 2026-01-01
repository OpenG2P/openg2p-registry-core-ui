import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/commons/globals.css";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { Header } from '@/components/layout';
// import '@openg2p/registry-widgets/dist/index.css';


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Registry Gen-02",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased pt-[70px]`}
            >
                <GlobalContextProvider>
                    <Header />
                    <main>
                        {children}
                    </main>
                </GlobalContextProvider>
            </body>
        </html>
    );
}
