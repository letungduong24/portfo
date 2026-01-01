import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // Fixed path
import { ThemeProvider } from "@/components/theme-provider";
import NavbarProvider from "@/components/NavbarProvider";
import { BubbleBackground } from "@/components/bubble-background";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import { AxiosErrorHandler } from "@/components/axios-error-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getProfileForMetadata } from "@/lib/get-profile";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const profile = await getProfileForMetadata();

  return {
    title: profile?.pageTitle || "Portfolio",
    description: profile?.pageDescription || "My Portfolio",
    icons: profile?.pageIcon ? [{ rel: "icon", url: profile.pageIcon }] : [{ rel: "icon", url: "/favicon.png" }],
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
            forcedTheme="dark"
          >
            <AxiosErrorHandler />
            <BubbleBackground
              className="w-full bg-zinc-900"
              interactive={true}
              colors={{
                first: '80,80,80',
                second: '90,90,90',
                third: '100,100,100',
                fourth: '120,120,120',
                fifth: '70,70,70',
                sixth: '80,80,80',
              }}
            >
              <NavbarProvider>
                {children}
              </NavbarProvider>
            </BubbleBackground>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
