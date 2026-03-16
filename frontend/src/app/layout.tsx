import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/navigation/site-header";
import { DeveloperGrid } from "@/components/ui/developer-grid";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontDisplay = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptForge – Discover, Share & Version AI Prompts",
  description: "The ultimate platform for developers to discover, test, and share high-performance AI prompts. Elevate your LLM workflows with PromptForge.",
  openGraph: {
    title: "PromptForge",
    description: "Discover, share & version AI prompts like code.",
    url: "https://prompt-forge-two-indol.vercel.app",
    siteName: "PromptForge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PromptForge",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge",
    description: "Discover, share & version AI prompts like code.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "googlef0018186a4f22908",
    other: {
      "msvalidate.01": "REPLACE_WITH_BING_VERIFICATION_CODE",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <LenisProvider>
            <div className="relative flex min-h-screen flex-col">
              <DeveloperGrid />
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <Toaster position="top-right" richColors />
            </div>
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
