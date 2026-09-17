import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import FeedbackHost from "@/components/ui/FeedbackHost";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/**
 * Prevents the "flash of wrong theme" before hydration.
 * Runs before paint: applies the `.dark` class on <html> based on the
 * stored preference ("light" | "dark" | "system") or the OS preference.
 */
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("elite-theme");
    var dark =
      stored === "dark" ||
      ((!stored || stored === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://eliteenglishacademy.magarohan8.workers.dev"),
  alternates: {
    canonical: "https://eliteenglishacademy.magarohan8.workers.dev",
  },

  title: {
    default: "'Elite's' English Academy | Spoken English, IELTS & Teacher Training",
    template: "%s | 'Elite's' English Academy",
  },

  description:
    "'Elite's' English Academy in Georai, Beed offers Spoken English, IELTS, Grammar, Phonics, Teacher Training, and Personal Mentorship programs with expert guidance from Prof. J. M. Wagh-Dhotre.",

  keywords: [
    "'Elite's' English Academy",
    "Spoken English Georai",
    "IELTS Coaching Beed",
    "English Teacher Training Maharashtra",
    "Personal Mentorship Georai",
    "English Classes Beed",
    "Grammar Classes Georai",
    "Phonics Training Beed",
  ],

  authors: [{ name: "Prof. J. M. Wagh-Dhotre" }],
  creator: "'Elite's' English Academy",
  publisher: "'Elite's' English Academy",

  openGraph: {
    title: "'Elite's' English Academy | Spoken English, IELTS & Teacher Training",
    description:
      "'Elite's' English Academy in Georai, Beed offers Spoken English, IELTS, Grammar, Phonics, Teacher Training, and Personal Mentorship programs with expert guidance from Prof. J. M. Wagh-Dhotre.",
    url: "https://eliteenglishacademy.magarohan8.workers.dev",
    siteName: "'Elite's' English Academy",
    locale: "en_IN",
    type: "website",
    phoneNumbers: ["+91 88887 11228"],
    emails: ["elitejamesw182025@gmail.com"],
    countryName: "India",
    images: [
      {
        url: "/vercel.png",
        width: 1200,
        height: 630,
        alt: "'Elite's' English Academy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "'Elite's' English Academy | Spoken English, IELTS & Teacher Training",
    description:
      "'Elite's' English Academy in Georai, Beed offers Spoken English, IELTS, Grammar, Phonics, Teacher Training, and Personal Mentorship programs with expert guidance from Prof. J. M. Wagh-Dhotre.",
    images: ["/vercel.png"],
    site: "@EliteEnglishAcademy",
    creator: "@EliteEnglishAcademy",
  },

  icons: {
    icon: [{ url: "/vercel.png", type: "image/svg+xml+png" }],
    apple: "/vercel.png",
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
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          {children}
          <FeedbackHost />
        </ThemeProvider>
      </body>
    </html>
  );
}