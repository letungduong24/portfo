import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "../globals.css"; // Fixed path
import { ThemeProvider } from "@/components/theme-provider";
import NavbarProvider from "@/components/NavbarProvider";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import { AxiosErrorHandler } from "@/components/axios-error-handler";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
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
        className={`${onest.className} antialiased`}
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
            {/* Midnight Mist Background */}
            <div
              className="fixed inset-0 -z-10 h-full w-full bg-black"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.3) 0%, transparent 60%),
                  radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.25) 0%, transparent 70%),
                  radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.15) 0%, transparent 80%)
                `,
              }}
            ></div>
            <NavbarProvider>
              {children}
            </NavbarProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
