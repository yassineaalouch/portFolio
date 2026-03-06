import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { siteName, siteUrl } from "@/lib/site";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const title = siteName;
const description =
  "Freelance Software Engineer, Full Stack Web Developer & Web Designer. Yassine Aalouch builds scalable web applications with React, Next.js, Node.js, TypeScript. Available for remote projects worldwide. مهندس برمجيات، مطور ويب، مصمم مواقع. Développeur full stack freelance.";

const keywords = [
  "freelance software engineer",
  "freelance web developer",
  "full stack developer",
  "full stack developer freelance",
  "web designer",
  "software engineer",
  "web developer",
  "React developer",
  "Next.js developer",
  "Node.js developer",
  "TypeScript developer",
  "frontend developer",
  "backend developer",
  "cloud architect",
  "مطور ويب مستقل",
  "مهندس برمجيات",
  "مصمم مواقع",
  "مطور full stack",
  "développeur web freelance",
  "ingénieur logiciel",
  "développeur full stack",
  "créateur de sites web",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: keywords.join(", "),
  authors: [{ name: "Yassine Aalouch", url: siteUrl }],
  creator: "Yassine Aalouch",
  publisher: "Yassine Aalouch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_SA"],
    url: siteUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en": siteUrl,
      "fr": siteUrl,
      "ar": siteUrl,
      "x-default": siteUrl,
    },
  },
  category: "technology",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "revisit-after": "7 days",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${spaceGrotesk.className} min-h-screen bg-background text-foreground antialiased`}
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
