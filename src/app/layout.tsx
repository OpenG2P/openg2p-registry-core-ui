import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/commons/globals.css";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { Header } from '@/components/layout';


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
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <GlobalContextProvider>
                    <Header />
                    <main className="transition-all duration-300 ease-in-out flex-1 pt-[70px] ml-[60px] lg:ml-[60px]">
                        {children}
                    </main>
                </GlobalContextProvider>
            </body>
        </html>
    );
}