import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tili Service",
  description: "Logiciel de caisse nouvelle génération",
  icons: {
    icon: "/tiliLogo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <Navbar />
            {children}
            <Toaster />
            <Sonner />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}