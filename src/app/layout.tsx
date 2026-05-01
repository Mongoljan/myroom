import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import I18nProvider from "@/components/providers/I18nProvider";
import { ToastProvider } from "@/components/common/ToastContainer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header1 from "@/components/header/Header1";
import Footer from "@/components/layout/Footer";
import NavigationProgress from "@/components/common/NavigationProgress";
import "./globals.css";

/**
 * Inter — chosen for broad script coverage:
 *  • Full Latin (all European + typographic glyphs)
 *  • Full Cyrillic including Mongolian chars (Өөүүнд, etc.)
 * Loaded via next/font for zero layout shift and self-hosting.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
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
      <head>
        {/* Inline script runs before React hydrates to avoid flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=t||s;document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(r);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <I18nProvider>
                <Suspense fallback={null}>
                  <NavigationProgress />
                </Suspense>
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
  
}
