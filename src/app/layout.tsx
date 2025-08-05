import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureVault - Password Manager",
  description: "Secure password manager with emoji-enhanced UI, password generation, and premium features.",
  keywords: ["password manager", "security", "password generator", "emoji UI", "SecureVault"],
  authors: [{ name: "SecureVault Team" }],
  openGraph: {
    title: "SecureVault - Password Manager",
    description: "Secure password manager with emoji-enhanced UI and premium features",
    url: "https://securevault.app",
    siteName: "SecureVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureVault - Password Manager",
    description: "Secure password manager with emoji-enhanced UI and premium features",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
