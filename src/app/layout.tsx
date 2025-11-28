import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import I18nProvider from "@/components/providers/I18nProvider";
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
  title: {
    default: "MyRoom - Зочид буудал захиалгын платформ",
    template: "%s | MyRoom"
  },
  description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй.",
  keywords: ["hotel booking", "зочид буудал", "захиалга", "Mongolia", "Монгол", "accommodation", "байр"],
  authors: [{ name: "MyRoom" }],
  creator: "MyRoom",
  publisher: "MyRoom",
  formatDetection: {
    email: false,
    telephone: true,
  },
  metadataBase: new URL("https://myroom.mn"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "mn": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    alternateLocale: "en_US",
    url: "https://myroom.mn",
    siteName: "MyRoom",
    title: "MyRoom - Зочид буудал захиалгын платформ",
    description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй.",
    images: [
      {
        url: "/img/general/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MyRoom - Hotel Booking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyRoom - Зочид буудал захиалгын платформ",
    description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй.",
    images: ["/img/general/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/img/general/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
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
        <ToastProvider>
          <I18nProvider>
            <div className="print:hidden">
              <Header1 />
            </div>
            <main className="">
              {children}
            </main>
            <div className="print:hidden">
              <Footer />
            </div>
          </I18nProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
