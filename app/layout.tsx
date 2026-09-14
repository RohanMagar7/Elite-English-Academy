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
  alternates: {
    canonical: "https://eliteenglishacademy.magarohan8.workers.dev",
  },

  title: {
    default: "Elite English Academy | Spoken English, IELTS & Teacher Training",
    template: "%s | Elite English Academy",
  },

  description:
    "Elite English Academy in Georai, Beed offers Spoken English, IELTS, Grammar, Phonics, Teacher Training, and Personal Mentorship programs with expert guidance from Prof. J. M. Wagh-Dhotre.",

  keywords: [
    "Elite English Academy",
    "Spoken English Georai",
    "IELTS Coaching Beed",
    "English Teacher Training Maharashtra",
    "Personal Mentorship Georai",
    "English Classes Beed",
    "Grammar Classes Georai",
    "Phonics Training Beed",
  ],

  authors: [{ name: "Prof. J. M. Wagh-Dhotre" }],
  creator: "Elite English Academy",
  publisher: "Elite English Academy",

  openGraph: {
    title: "Elite English Academy | Spoken English, IELTS & Teacher Training",
    description:
      "Elite English Academy in Georai, Beed offers Spoken English, IELTS, Grammar, Phonics, Teacher Training, and Personal Mentorship programs with expert guidance from Prof. J. M. Wagh-Dhotre.",
    url: "https://eliteenglishacademy.magarohan8.workers.dev",
    siteName: "Elite English Academy",
    locale: "en_IN",
    type: "website",
    phoneNumbers: ["+91 88887 11228"],
    emails: ["elitejamesw182025@gmail.com"],
    countryName: "India",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elite English Academy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Elite English Academy | Spoken English, IELTS & Teacher Training",
    description:
      "Elite English Academy in Georai, Beed offers Spoken English, IELTS, Grammar, Phonics, Teacher Training, and Personal Mentorship programs with expert guidance from Prof. J. M. Wagh-Dhotre.",
    images: ["/og-image.jpg"],
    site: "@EliteEnglishAcademy",
    creator: "@EliteEnglishAcademy",
  },

  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}