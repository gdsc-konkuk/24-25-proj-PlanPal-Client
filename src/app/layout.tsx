import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/initializer/auth-initializer";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://planpal.site"),
  title: "PlanPal - Map, Chat, Go",
  keywords: [
    "PlanPal",
    "Map",
    "Chat",
    "Go",
    "Planning",
    "Travel",
    "Group",
    "Chat",
    "Group Chat",
    "Group AI Chat",
    "AI",
    "AI Chat",
    "Map",
  ],
  description:
    "PlanPal is a group planning tool that helps you map, chat, and go. It allows you to create a map with your friends, chat with them, and plan your trip together.",
  authors: [
    {
      name: "GDG on Campus Konkuk",
      url: "https://gdg.community.dev/gdg-on-campus-konkuk-university-seoul-south-korea/",
    },
  ],
  creator: "GDG on Campus Konkuk",
  publisher: "GDG on Campus Konkuk",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PlanPal",
    description: "Map, Chat, Go",
    url: "https://planpal.site",
    siteName: "PlanPal",
    images: "/logo.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanPal",
    description: "Map, Chat, Go",
    images: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        suppressHydrationWarning
      >
        <AuthInitializer />
        <Toaster />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
