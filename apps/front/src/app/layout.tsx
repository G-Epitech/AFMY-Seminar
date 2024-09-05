import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/redux-provider";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { MainMenu } from "@/components/menus/main";

import 'reflect-metadata';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Seminar App",
    description: "What a good application for seminars!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <Script
                src="https://kit.fontawesome.com/a6c187ac23.js"
                crossOrigin="anonymous"
            />
            <body className={inter.className}>
                <ReduxProvider>
                    {children}
                    <Toaster />
                </ReduxProvider>
            </body>
        </html>
    );
}
