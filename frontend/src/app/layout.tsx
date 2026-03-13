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
  description: "The premier platform for developers to browse, upload, fork, and manage structured AI prompts.",
  icons: {
    icon: "/favicon.ico",
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
