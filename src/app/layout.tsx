import { AuthProvider } from "@/context/AuthContext";
import { BookmarksProvider } from "@/context/BookmarksContext";
import { Chatbot } from "@/components/Chatbot";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://dome-dine-frontend-56.vercel.app";
// once you get a custom domain, just change siteUrl above — everything else updates automatically

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dorm & Dine — Find hostels & mess near your campus",
    template: "%s | Dorm & Dine",
  },
  description:
    "Real-time hostel and mess listings for students, with verified reviews and live availability. Search hostels and mess near UCP, UET, GCU, Punjab University, and FAST Lahore.",
  keywords: [
    "hostel finder Lahore",
    "student hostel Pakistan",
    "mess near campus",
    "UCP hostel",
    "UET Lahore hostel",
    "GCU hostel",
    "FAST Lahore hostel",
    "student accommodation Lahore",
  ],
  authors: [{ name: "Dorm & Dine" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Dorm & Dine",
    title: "Dorm & Dine — Find hostels & mess near your campus",
    description:
      "Real-time hostel and mess listings for students, with verified reviews and live availability.",
    images: [
      {
        url: "/og-image.png", // add a 1200x630 image at public/og-image.png
        width: 1200,
        height: 630,
        alt: "Dorm & Dine — hostel and mess finder for students",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dorm & Dine — Find hostels & mess near your campus",
    description:
      "Real-time hostel and mess listings for students, with verified reviews and live availability.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <BookmarksProvider>
            {children}
            <Chatbot />
          </BookmarksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}