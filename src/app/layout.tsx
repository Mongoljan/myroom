import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import I18nProvider from "@/components/providers/I18nProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/common/ToastContainer";
import Header1 from "@/components/header/Header1";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyRoom - Hotel Booking Platform",
  description: "Find and book amazing hotels at exclusive deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            <I18nProvider>
              <Header1 />
              <main className="pt-10">
                {children}
              </main>
              <Footer />
            </I18nProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
