import { AuthProvider } from "@/context/AuthContext";
import { BookmarksProvider } from "@/context/BookmarksContext";
import { Chatbot } from "@/components/Chatbot";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dorm & Dine — Find hostels & mess near your campus",
  description:
    "Real-time hostel and mess listings for students, with verified reviews and live availability.",
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