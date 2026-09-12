import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://eliteenglishacademy.magarohan8.workers.dev"),

  title: {
    default: "Elite English Academy | Spoken English & IELTS Coaching",
    template: "%s | Elite English Academy",
  },

  description:
    "Elite English Academy helps students improve Spoken English, Grammar, IELTS, PTE, and Communication Skills through expert guidance and practical learning.",

  keywords: [
    "Elite English Academy",
    "Spoken English Classes",
    "IELTS Coaching",
    "PTE Coaching",
    "English Grammar Classes",
    "Communication Skills",
    "English Academy Maharashtra",
    "Online Spoken English",
  ],

  authors: [{ name: "Elite English Academy" }],
  creator: "Elite English Academy",

  openGraph: {
    title: "Elite English Academy | Spoken English & IELTS Coaching",
    description:
      "Join Elite English Academy for Spoken English, IELTS, PTE, Grammar, and Communication Skills training.",
    url: "https://eliteenglishacademy.magarohan8.workers.dev",
    siteName: "Elite English Academy",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Place og-image.jpg inside /public
        width: 1200,
        height: 630,
        alt: "Elite English Academy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Elite English Academy | Spoken English & IELTS Coaching",
    description:
      "Improve your English with Spoken English, IELTS, PTE, Grammar, and Communication Skills courses.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}